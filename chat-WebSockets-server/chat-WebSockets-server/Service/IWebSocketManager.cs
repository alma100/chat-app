﻿using System.Net.WebSockets;
using chat_WebSockets_server.Model;

namespace chat_WebSockets_server.Service;

public interface IWebSocketManager
{
    Task<bool> AddSocketToGroup(WebSocket socket, string userID);
    List<WebSocket> FindTargetedUser(List<User> users);

    void RemoveSocket(WebSocket socket);
}