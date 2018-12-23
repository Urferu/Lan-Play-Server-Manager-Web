using System;
using System.IO;
using Microsoft.Win32;
using System.Net;
using System.Net.Cache;
using System.Diagnostics;
using System.Windows.Forms;

namespace ServerManagerInstaller
{
    static class Program
    {
        /// <summary>
        /// Punto de entrada principal para la aplicación.
        /// </summary>
        [STAThread]
        static void Main()
        {
            string path = "";
            try
            {
                Directory.CreateDirectory(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + "\\Lan Play Server Manager Service");
                path = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + "\\Lan Play Server Manager Service\\";
                if (File.Exists(path + "Server Manager Service.exe"))
                {
                    MessageBox.Show("The application is already installed please run it on the route:\n" + path + "Server Manager Service.exe");
                }
                else
                {
                    if (downloadFile(path + "config.json", "https://github.com/Urferu/Lan-Play-Server-Manager-Web/raw/master/Releases/config.json") &&
                        downloadFile(path + "servers.json", "https://github.com/Urferu/Lan-Play-Server-Manager-Web/raw/master/Releases/servers.json") &&
                        downloadFile(path + "Server Manager Service.exe", "https://github.com/Urferu/Lan-Play-Server-Manager-Web/raw/master/Releases/ServerManagerService.exe"))
                    {
                        prepararProgramaInicioWindows();
                        System.Threading.Thread.Sleep(300);
                        Process.Start(path + "Server Manager Service.exe");
                        MessageBox.Show("Install Finish");
                    }
                    else
                        MessageBox.Show("No se pudo instalar aplicación");
                }
            }
            catch(Exception ex)
            {
                MessageBox.Show("No se pudo instalar aplicación error: " + ex.Message);
            }
        }

        #region Inicio Con Windows
        /// <summary>
        /// Se encarga de verificar para iniciar el sistema con windows
        /// </summary>
        private static void prepararProgramaInicioWindows()
        {
            RegistryKey registro = Registry.LocalMachine.OpenSubKey(
                "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\", true);
            if (verificaInicio(registro))
            {
                activarInicioWindows(registro);
            }
        }

        /// <summary>
        /// Se encarga de validar si ya se encuentra configurado el inicio con windows
        /// </summary>
        /// <param name="registro">Corresponde a la llave de registro en el inicio</param>
        /// <returns></returns>
        private static bool verificaInicio(RegistryKey registro)
        {
            bool continua = true;
            string[] registrosInstalados = registro.GetValueNames();

            for (int i = 0; continua && i < registrosInstalados.Length; i++)
            {
                if (registrosInstalados[i].ToUpper().Contains("LanPlayServerManagerService"))
                {
                    continua = false;
                }
            }
            return continua;
        }

        /// <summary>
        /// Se encarga de activar el inicio de sesion con windows
        /// </summary>
        /// <param name="registro">Corresponde a la llave de registro donde se agregará el registro</param>
        private static void activarInicioWindows(RegistryKey registro)
        {
            registro.SetValue("LanPlayServerManagerService",
                "\"" + Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + "\\Lan Play Server Manager Service\\Server Manager Service.exe" + "\"", RegistryValueKind.String);
        }
        #endregion

        private static bool downloadFile(string exeDownload, string url, bool hidden = false)
        {
            int bufferSize = 1024;
            byte[] buffer = new byte[bufferSize];
            int bytesRead = 0;
            bool cerrar = false;
            ServicePointManager.Expect100Continue = true;
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            var webrequest = (HttpWebRequest)WebRequest.Create(url);
            HttpRequestCachePolicy noCachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.NoCacheNoStore);
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
    }
}
