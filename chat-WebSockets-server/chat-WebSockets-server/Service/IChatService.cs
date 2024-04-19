using System.Net.WebSockets;

namespace chat_WebSockets_server.Service;

public interface IChatService
{
    Task HandleWebSocketConnection(WebSocket socket);
    
    static Dictionary<string, WebSocket> SocketGroups { get; set; }
}