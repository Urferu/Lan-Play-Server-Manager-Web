using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using ServerManagerService.Clases;

namespace ServerManagerService
{
    internal class WebServer : IDisposable
    {
        private int PORT = 2308;
        private Logica.LogicService serviceLogic;

        private readonly HttpListener _listener;

        private readonly Thread _listenerThread;

        private readonly Thread[] _workers;

        private readonly ManualResetEvent _stop;

        private readonly ManualResetEvent _ready;

        private Queue<HttpListenerContext> _queue;

        private void doPost(HttpListenerContext context)
        {
            try
            {
                if (context.Request.RawUrl.Trim() == "/api/connect")
                {
                    string responseString = serviceLogic.ConectarLanPlay(stdClassCSharp.jsonToStdClass(this.getInput(context)));
                    this.sendOutput(responseString, context);
                }
                else if (context.Request.RawUrl.Trim() == "/api/disconnect")
                {
                    string responseString = serviceLogic.DesconectarLanPlay(stdClassCSharp.jsonToStdClass(this.getInput(context)));
                    this.sendOutput(responseString, context);
                }
                else if (context.Request.RawUrl.Trim() == "/api/server")
                {
                    string responseString = serviceLogic.AddServer(stdClassCSharp.jsonToStdClass(this.getInput(context)));
                    this.sendOutput(responseString, context);
                }
                else if(context.Request.RawUrl.Trim() == "/api/savesettings")
                {
                    string responseString = serviceLogic.SaveSettings(stdClassCSharp.jsonToStdClass(this.getInput(context)));
                    this.sendOutput(responseString, context);
                }
                else if (context.Request.RawUrl.Trim() == "/api/downloadjson")
                {
                    string responseString = serviceLogic.DownloadJsonService(stdClassCSharp.jsonToStdClass(this.getInput(context)));
                    this.sendOutput(responseString, context);
                }
                else
                {
                    this.sendOutput("{ \"message\":\"Route Not Found\"}", context);
                }
            }
            catch (Exception ex)
            {
                this.sendOutput("{\"message\":\"" + ex.Message + "\" }", context);
            }
        }

        private void doGet(HttpListenerContext context)
        {
            if (context.Request.RawUrl.Trim().Contains("/api/state"))
            {
                this.sendOutput(serviceLogic.ObtenerEstado(), context);
                return;
            }
            else if (context.Request.RawUrl.Trim().Contains("/api/server"))
            {
                string responseString = serviceLogic.GetServers();
                this.sendOutput(responseString, context);
            }
            this.sendOutput("{\"message\":\"Route Not Found\"}", context);
        }

        private void doOptions(HttpListenerContext context)
        {
            if (context.Request.RawUrl.Trim().Contains("/api/state"))
            {
                this.sendOutput("{\"status\":\"Ok.\"}", context);
                return;
            }
            else if (context.Request.RawUrl.Trim() == "/api/connect")
            {
                this.sendOutput("{\"status\":\"Ok.\"}", context);
                return;
            }
            else if (context.Request.RawUrl.Trim() == "/api/disconnect")
            {
                this.sendOutput("{\"status\":\"Ok.\"}", context);
                return;
            }
            else if (context.Request.RawUrl.Trim() == "/api/server")
            {
                this.sendOutput("{\"status\":\"Ok.\"}", context);
                return;
            }
            else if (context.Request.RawUrl.Trim() == "/api/savesettings")
            {
                this.sendOutput("{\"status\":\"Ok.\"}", context);
                return;
            }
            else if (context.Request.RawUrl.Trim() == "/api/downloadjson")
            {
                this.sendOutput("{\"status\":\"Ok.\"}", context);
                return;
            }
            this.sendOutput("{\"message\":\"Route Not Found\"}", context);
        }

        private string getInput(HttpListenerContext context)
        {
            if (!context.Request.HasEntityBody)
            {
                throw new ArgumentNullException("json", "No se recibieron datos");
            }
            Stream inputStream = context.Request.InputStream;
            Encoding contentEncoding = context.Request.ContentEncoding;
            StreamReader streamReader = new StreamReader(inputStream, contentEncoding);
            string result = streamReader.ReadToEnd();
            inputStream.Close();
            streamReader.Close();
            return result;
        }

        private void sendOutput(string responseString, HttpListenerContext context)
        {
            try
            {
                byte[] bytes = Encoding.UTF8.GetBytes(responseString);
                context.Response.ContentLength64 = (long)bytes.Length;
                Stream outputStream = context.Response.OutputStream;
                outputStream.Write(bytes, 0, bytes.Length);
                outputStream.Close();
            }
            catch (Exception)
            {
            }
        }

        private void addHeader(string name, string value, HttpListenerContext context)
        {
            context.Response.AppendHeader(name, value);
        }

        private void setHeaders(HttpListenerContext context)
        {
            context.Response.AppendHeader("Access-Control-Allow-Origin", "*");
            context.Response.AppendHeader("Access-Control-Allow-Headers", "*");
            context.Response.AppendHeader("Content-Type", "Application/json");
        }

        public WebServer(int maxThreads)
        {
            serviceLogic = new Logica.LogicService();
            //mensajesFormulario = new formularioMensajes();
            this._workers = new Thread[maxThreads];
            this._queue = new Queue<HttpListenerContext>();
            this._stop = new ManualResetEvent(false);
            this._ready = new ManualResetEvent(false);
            this._listener = new HttpListener();
            this._listenerThread = new Thread(new ThreadStart(this.HandleRequests));
        }

        public void start(string ipCargar = "localhost")
        {
            if (HttpListener.IsSupported)
            {
                try
                {
                    this._listener.Prefixes.Add(string.Format("http://{0}:{1}/", ipCargar, this.PORT));
                    this._listener.Start();
                    this._listenerThread.Start();
                    for (int i = 0; i < this._workers.Length; i++)
                    {
                        this._workers[i] = new Thread(new ThreadStart(this.Worker));
                        this._workers[i].Start();
                    }
                    return;
                }
                catch (Exception ex)
                {
                    System.Windows.Forms.MessageBox.Show(ex.Message);
                    return;
                }
            }
        }

        public void Dispose()
        {
            this.Stop();
        }

        public void Stop()
        {
            this._stop.Set();
            this._listenerThread.Join();
            Thread[] workers = this._workers;
            for (int i = 0; i < workers.Length; i++)
            {
                Thread thread = workers[i];
                thread.Join();
            }
            this._listener.Stop();
        }

        private void HandleRequests()
        {
            while (this._listener.IsListening)
            {
                IAsyncResult asyncResult = this._listener.BeginGetContext(new AsyncCallback(this.ContextReady), null);
                if (WaitHandle.WaitAny(new WaitHandle[]
				{
					this._stop,
					asyncResult.AsyncWaitHandle
				}) == 0)
                {
                    return;
                }
            }
        }

        private void ContextReady(IAsyncResult ar)
        {
            try
            {
                lock (this._queue)
                {
                    this._queue.Enqueue(this._listener.EndGetContext(ar));
                    this._ready.Set();
                }
            }
            catch
            {
            }
        }

        private void Worker()
        {
            WaitHandle[] waitHandles = new ManualResetEvent[]
			{
				this._ready,
				this._stop
			};
            while (WaitHandle.WaitAny(waitHandles) == 0)
            {
                HttpListenerContext httpListenerContext;
                lock (this._queue)
                {
                    if (this._queue.Count <= 0)
                    {
                        this._ready.Reset();
                        continue;
                    }
                    httpListenerContext = this._queue.Dequeue();
                }
                try
                {
                    this.setHeaders(httpListenerContext);
                    if (httpListenerContext.Request.HttpMethod == "GET")
                    {
                        this.doGet(httpListenerContext);
                    }
                    else if (httpListenerContext.Request.HttpMethod == "POST")
                    {
                        this.doPost(httpListenerContext);
                    }
                    else if (httpListenerContext.Request.HttpMethod == "OPTIONS")
                    {
                        this.doOptions(httpListenerContext);
                    }
                }
                catch (Exception ex)
                {
                }
            }
        }
    }
}
