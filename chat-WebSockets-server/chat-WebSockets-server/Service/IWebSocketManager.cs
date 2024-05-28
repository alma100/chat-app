using System.Net.WebSockets;
using chat_WebSockets_server.Model;

namespace chat_WebSockets_server.Service;

public interface IWebSocketManager
{
    Task<bool> AddSocketToGroup(WebSocket socket, string userID);
    Dictionary<string, WebSocket> FindTargetedUser(List<User> users);

    string RemoveSocket(WebSocket socket);
}