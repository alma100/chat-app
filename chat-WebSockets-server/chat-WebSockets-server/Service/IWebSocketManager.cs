using System.Net.WebSockets;
using chat_WebSockets_server.Model;

namespace chat_WebSockets_server.Service;

public interface IWebSocketManager
{
    bool AddSocketToGroup(WebSocket socket, string userId);
    List<WebSocket> FindTargetedUser(List<User> users);

    void RemoveSocket(WebSocket socket);
}