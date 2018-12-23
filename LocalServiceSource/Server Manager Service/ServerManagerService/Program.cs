using System;
using System.IO;

namespace ServerManagerService
{
    static class Program
    {
        /// <summary>
        /// Punto de entrada principal para la aplicación.
        /// </summary>
        [STAThread]
        static void Main()
        {
            string directory = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + "\\Lan Play Server Manager Service\\";
            if (!AppDomain.CurrentDomain.FriendlyName.Equals("Server Manager Service.exe"))
            {
                File.Copy(directory + AppDomain.CurrentDomain.FriendlyName, directory + "Server Manager Service.exe", true);
                System.Diagnostics.Process splc = new System.Diagnostics.Process();
                splc.StartInfo = new System.Diagnostics.ProcessStartInfo(directory + "Server Manager Service.exe");
                splc.Start();
            }
            else
            {
                if (File.Exists(directory + "Server Manager Service.Upd.exe"))
                {
                    File.Delete(directory + "Server Manager Service.Upd.exe");
                }
                Lanzador.lanzar();
            }
        }
    }
}
