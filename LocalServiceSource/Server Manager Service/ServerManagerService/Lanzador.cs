using System.Net;

namespace ServerManagerService
{
    class Lanzador
    {
        public static void lanzar()
        {
            WebServer webServer = new WebServer(10);
            webServer.start();
        }
    }
}
