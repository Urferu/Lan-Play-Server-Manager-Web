using System;
using System.IO;
using System.Net;
using System.Net.Cache;
using System.Diagnostics;
using System.Net.NetworkInformation;
using ServerManagerService.Clases;

namespace ServerManagerService.Logica
{
    class LogicService
    {
        const int _SERVICE_VERSION = 100;
        string versionActual = "v0.0.7";
        string identificadorIp = "";
        string directoryLocal = "";
        Process bat;
        HttpRequestCachePolicy noCachePolicy;
        stdClassCSharp configActual;
        stdClassCSharp conexionState;
        stdClassCSharp localServers;

        public LogicService()
        {
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            noCachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.NoCacheNoStore);
            directoryLocal = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + "\\Lan Play Server Manager Service\\";
            bat = new Process();
            localServers = new stdClassCSharp();
            VerificarVersion();
            inicializeState();
            GetActualVersion();
            LoadPmtu();
        }

        #region Metodos iniciales
        private void VerificarVersion()
        {
            string versionRepositorio = DownloadStringServer("https://raw.githubusercontent.com/Urferu/Lan-Play-Server-Manager-Web/master/LocalServiceSource/Server Manager Service/last-version.txt");
            if (!string.IsNullOrWhiteSpace(versionRepositorio))
            {
                if (_SERVICE_VERSION < Convert.ToInt32(versionRepositorio))
                {
                    downloadFile(directoryLocal + "Server Manager Service.Upd.exe", "https://github.com/Urferu/Lan-Play-Server-Manager-Web/raw/master/Releases/ServerManagerService.exe");
                    Process.Start(directoryLocal + "Server Manager Service.Upd.exe");
                    Process.GetCurrentProcess().Close();
                }
            }
        }

        private void inicializeState()
        {
            conexionState = new stdClassCSharp();
            conexionState["state"] = "disconnect";
            conexionState["server"] = "";
            conexionState["serverNum"] = "0";
        }

        /// <summary>
        /// Consulta la version actual utilizada de lan-play
        /// </summary>
        private void GetActualVersion()
        {
            if (File.Exists("versionActual.dat"))
            {
                StreamReader srArchivo = new StreamReader(directoryLocal + "versionActual.dat");
                string leer = srArchivo.ReadLine();
                if (!string.IsNullOrWhiteSpace(leer))
                {
                    versionActual = leer;
                }
            }
        }

        private void LoadPmtu(bool guardar = false)
        {
            if (!guardar)
            {
                configActual = stdClassCSharp.readJsonFile(directoryLocal + "config.json");
                localServers = stdClassCSharp.readJsonFile(directoryLocal + "servers.json");
            }
            else
            {
                configActual.writeJsonFile(directoryLocal + "config.json");
            }
        }
        #endregion

        #region servicios

        private string DownloadStringServer(string url)
        {
            string responseFromServer = string.Empty;
            var webrequest = (HttpWebRequest)WebRequest.Create(url);
            webrequest.CachePolicy = noCachePolicy;
            webrequest.Method = WebRequestMethods.Http.Get;

            try
            {
                using (WebResponse response = webrequest.GetResponse())
                {
                    using (Stream stream2 = response.GetResponseStream())
                    {
                        using (StreamReader reader = new StreamReader(stream2))
                        {
                            responseFromServer = reader.ReadToEnd();
                            reader.Close();
                        }
                        stream2.Close();
                    }
                    response.Close();
                }

                if (string.IsNullOrWhiteSpace(responseFromServer))
                {
                    responseFromServer = "";
                }
            }
            catch
            {
            }
            return responseFromServer;
        }
        /// <summary>
        /// Descarga el archivo de la web
        /// </summary>
        /// <param name="exeDownload">Corresponde al nombre del archivo al descargarse</param>
        /// <param name="url">Url donde se descargará el archivo</param>
        /// <returns></returns>
        private bool downloadFile(string exeDownload, string url, bool hidden = false)
        {
            int bufferSize = 1024;
            byte[] buffer = new byte[bufferSize];
            int bytesRead = 0;
            bool cerrar = false;

            var webrequest = (HttpWebRequest)WebRequest.Create(url);
            webrequest.CachePolicy = noCachePolicy;

            webrequest.Method = WebRequestMethods.Http.Get;
            if (File.Exists(exeDownload))
                File.SetAttributes(exeDownload, FileAttributes.Normal);
            FileStream fileStream = File.Create(exeDownload);

            try
            {
                using (HttpWebResponse response = (HttpWebResponse)webrequest.GetResponse())
                {
                    using (Stream stream = response.GetResponseStream())
                    {
                        bytesRead = stream.Read(buffer, 0, bufferSize);
                        if (bytesRead == 0)
                        {
                            cerrar = true;
                        }

                        while (bytesRead != 0)
                        {
                            fileStream.Write(buffer, 0, bytesRead);
                            bytesRead = stream.Read(buffer, 0, bufferSize);
                        }
                        stream.Close();
                    }
                    response.Close();
                }
            }
            catch
            {
                cerrar = true;
            }
            fileStream.Close();
            if (hidden)
                File.SetAttributes(exeDownload, FileAttributes.Hidden);
            if (cerrar)
            {
                File.SetAttributes(exeDownload, FileAttributes.Normal);
                File.Delete(exeDownload);
            }
            return !cerrar;
        }

        #endregion

        #region Metodos Privados de apoyo

        /// <summary>
        /// Se encarga de descargar y geberar el archivo lan-play.exe
        /// </summary>
        /// <returns>debuelve si se ejecuto correctamente</returns>
        private bool GenerarLanPlay(stdClassCSharp respuesta)
        {
            string nombreLanPlay = "lan-play-win32.exe";
            int bufferSize = 1024;
            byte[] buffer = new byte[bufferSize];
            int bytesRead = 0;
            bool cerrar = false;

            if (Environment.Is64BitOperatingSystem)
            {
                nombreLanPlay = "lan-play-win64.exe";
            }

            if (versionActual.Equals("v0.0.3") || versionActual.Equals("v0.0.2") || versionActual.Equals("v0.0.1"))
            {
                nombreLanPlay = "lan-play.exe";
            }

            var webrequest = (HttpWebRequest)WebRequest.Create(
                string.Format("https://github.com/spacemeowx2/switch-lan-play/releases/download/{0}/{1}", versionActual, nombreLanPlay));

            webrequest.Method = WebRequestMethods.Http.Get;
            FileStream fileStream = File.Create(directoryLocal + "lan-play.exe");

            try
            {
                using (HttpWebResponse response = (HttpWebResponse)webrequest.GetResponse())
                {
                    using (Stream stream = response.GetResponseStream())
                    {
                        bytesRead = stream.Read(buffer, 0, bufferSize);
                        if (bytesRead == 0)
                        {
                            cerrar = true;
                        }

                        while (bytesRead != 0)
                        {
                            fileStream.Write(buffer, 0, bytesRead);
                            bytesRead = stream.Read(buffer, 0, bufferSize);
                        }
                        stream.Close();
                    }
                    response.Close();
                }
                if (cerrar)
                {
                    respuesta["message"] = "No se pudo descargar el archivo, por favor verifique que la versión seleccionada se encuentre disponible en:\n https://github.com/spacemeowx2/switch-lan-play/releases";
                }
                else
                {
                    StreamWriter version = new StreamWriter(directoryLocal + "versionActual.dat", false);
                    version.WriteLine(versionActual);
                    version.Close();
                }
            }
            catch
            {
                respuesta["message"] = "No se pudo descargar el archivo, por favor verifique que la versión seleccionada se encuentre disponible en:\n https://github.com/spacemeowx2/switch-lan-play/releases";
                cerrar = true;
            }
            finally
            {
                fileStream.Close();
                if (cerrar)
                {
                    File.Delete(directoryLocal + "lan-play.exe");
                }
            }
            return !cerrar;
        }

        /// <summary>
        /// Obtiene el identificador correcto del dispositivo de red para lan-play
        /// </summary>
        private void GetFunctionalDiviceId()
        {
            foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
            {
                foreach (UnicastIPAddressInformation ip in ni.GetIPProperties().UnicastAddresses)
                {
                    if (ni.GetIPProperties().GatewayAddresses.Count > 0)
                    {
                        if (ip.Address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork && ni.OperationalStatus == OperationalStatus.Up)
                        {
                            identificadorIp = "\\Device\\NPF_" + ni.Id;
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Se encarga de lanzar lan-play
        /// <param name="parameters">Corresponden a los parametros enviados desde la web</param>
        /// </summary>
        private void LaunchLanPlay(stdClassCSharp parameters, stdClassCSharp respuesta)
        {
            string parametros = string.Empty;
            try
            {
                parametros = "--relay-server-addr " + parameters["ipDnsServer"] + ":11451";
                //Si se encontro identificador lanzamos directamente el identificador a lan-play
                if (!string.IsNullOrWhiteSpace(identificadorIp))
                {
                    parametros = parametros + " --netif " + identificadorIp;
                }

                //Si la versión es la 0.0.5 o mayor se agrega el parametro --fake-internet
                if (!versionActual.Equals("v0.0.3") && !versionActual.Equals("v0.0.2") && !versionActual.Equals("v0.0.1") && !versionActual.Equals("v0.0.4") && parameters["fakeInternet", TiposDevolver.Boleano])
                {
                    parametros = parametros + " --fake-internet";
                }

                //Si la versión es la 0.0.6 o mayor se agrega el parametro --fake-internet
                if (!versionActual.Equals("v0.0.3") && !versionActual.Equals("v0.0.2") && !versionActual.Equals("v0.0.1") && !versionActual.Equals("v0.0.4") && !versionActual.Equals("v0.0.5"))
                {
                    parametros = parametros + " --pmtu " + parameters["pmtu"];
                }

                bat.StartInfo = new ProcessStartInfo(directoryLocal + "lan-play.exe", parametros);
                
                bat.EnableRaisingEvents = true;
                bat.Exited += lanplayexit;
                if(!parameters["showConsole", TiposDevolver.Boleano])
                {
                    bat.StartInfo.UseShellExecute = false;
                    bat.StartInfo.CreateNoWindow = true;
                    bat.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
                }
                bat.Start();
                if (parameters["showConsole", TiposDevolver.Boleano])
                {
                    while (bat.MainWindowHandle.ToInt32() == 0)
                    {
                    }
                    if (bat.MainWindowHandle.ToInt32() > 0)
                    {
                    }
                    WinApi.SetForegroundWindow(bat.MainWindowHandle);
                }
            }
            catch
            {
                respuesta["message"] = "Ocurrió un error al ejecutar lan-play.exe";
            }
        }

        private void lanplayexit(object sender, EventArgs e)
        {
            try
            {
                try
                {
                    bat.Kill();
                }
                catch
                {
                }
                inicializeState();
            }
            catch
            {
            }
        }

        private void UpdateStates(stdClassCSharp parameters, stdClassCSharp respuesta)
        {
            try
            {
                conexionState["state"] = "connected";
                conexionState["server"] = parameters["ipDnsServer"];
                conexionState["serverNum"] = parameters["numServer"];
                configActual["lanPlayVersion"] = versionActual;
                configActual["pmtu"] = parameters["pmtu"];
                configActual["selectedInterfaz"] = parameters["selectedInterfaz"];
                configActual["fakeInternet"] = parameters["fakeInternet"];
                configActual["showConsole"] = parameters["showConsole"];
                configActual["languageUser"] = parameters["languageUser"];
                LoadPmtu(true);
            }
            catch
            {
                respuesta["message"] = "Ocurrió un error al actualizar información.";
            }
        }

        private stdClassCSharp ObtenerEstadoActual()
        {
            stdClassCSharp respuesta = new stdClassCSharp();
            respuesta["state"] = conexionState["state"];
            respuesta["ipDnsServer"] = conexionState["server"];
            respuesta["numServer"] = conexionState["serverNum"];
            respuesta["lanPlayVersion"] = configActual["lanPlayVersion"];
            respuesta["pmtu"] = configActual["pmtu"];
            respuesta["selectedInterfaz"] = configActual["selectedInterfaz"];
            respuesta["fakeInternet"] = configActual["fakeInternet"];
            respuesta["showConsole"] = configActual["showConsole"];
            if (configActual["languageUser", TiposDevolver.Boleano])
                respuesta["languageUser"] = configActual["languageUser"];
            return respuesta;
        }

        #endregion

        #region Respuestas de Servicio

        public string ObtenerEstado()
        {
            return ObtenerEstadoActual().jsonValue;
        }

        public string ConectarLanPlay(stdClassCSharp parameters)
        {
            stdClassCSharp respuesta = new stdClassCSharp();
            identificadorIp = "";
            bool ejecutar = true;
            try
            {
                if (!File.Exists("lan-play.exe") || (!parameters["lanPlayVersion", TiposDevolver.Cadena].Equals(versionActual)))
                {
                    versionActual = parameters["lanPlayVersion", TiposDevolver.Cadena];
                    ejecutar = GenerarLanPlay(respuesta);
                }

                if (ejecutar)
                {
                    if (parameters["selectedInterfaz", TiposDevolver.Boleano])
                        GetFunctionalDiviceId();
                    LaunchLanPlay(parameters, respuesta);
                    UpdateStates(parameters, respuesta);

                    respuesta["status"] = "Ok.";
                    respuesta["data"] = ObtenerEstadoActual();
                }
            }
            catch
            {
                respuesta["message"] = "Ocurrió un error al lanzar lan-play.exe";
            }
            return respuesta.jsonValue;
        }

        public string DesconectarLanPlay(stdClassCSharp parameters)
        {
            stdClassCSharp respuesta = new stdClassCSharp();
            identificadorIp = "";
            try
            {
                lanplayexit(null, null);
                respuesta["status"] = "Ok.";
                respuesta["data"] = ObtenerEstadoActual();
            }
            catch
            {
                respuesta["message"] = "Ocurrió un error al cerrar lan-play.exe";
            }
            return respuesta.jsonValue;
        }

        public string AddServer(stdClassCSharp parameters)
        {
            stdClassCSharp respuesta = new stdClassCSharp();
            try
            {
                localServers.Add(parameters);
                localServers.writeJsonFile(directoryLocal + "servers.json");
                respuesta["status"] = "Ok.";
                respuesta["data"] = localServers;
            }
            catch
            {
                respuesta["message"] = "Ocurrió un error al agregar servidor";
            }
            return respuesta.jsonValue;
        }

        public string GetServers()
        {
            return localServers.jsonValue;
        }

        public string SaveSettings(stdClassCSharp parameters)
        {
            stdClassCSharp respuesta = new stdClassCSharp();
            try
            {
                configActual["lanPlayVersion"] = parameters["lanPlayVersion"];
                configActual["pmtu"] = parameters["pmtu"];
                configActual["selectedInterfaz"] = parameters["selectedInterfaz"];
                configActual["fakeInternet"] = parameters["fakeInternet"];
                configActual["showConsole"] = parameters["showConsole"];
                configActual["languageUser"] = parameters["languageUser"];
                LoadPmtu(true);
                respuesta["status"] = "Ok.";
            }
            catch
            {
                respuesta["message"] = "Ocurrió un error al guardar configuración";
            }
            return respuesta.jsonValue;
        }

        public string DownloadJsonService(stdClassCSharp parameters)
        {
            stdClassCSharp respuesta = new stdClassCSharp();
            try
            {
                DateTime tiempoInicio = DateTime.Now;
                respuesta["data"] = stdClassCSharp.jsonToStdClass(DownloadStringServer(parameters["uri"]));
                DateTime tiempoFin = DateTime.Now;
                if (parameters["ping", TiposDevolver.Boleano])
                    respuesta["data"]["ping"] = (tiempoFin - tiempoInicio).Milliseconds;
                respuesta["status"] = "Ok.";
            }
            catch
            {
                respuesta["message"] = "Ocurrió un error al guardar configuración";
            }
            return respuesta.jsonValue;
        }

        #endregion
    }
}
