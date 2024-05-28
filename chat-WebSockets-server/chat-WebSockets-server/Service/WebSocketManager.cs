﻿using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using chat_WebSockets_server.Model;

namespace chat_WebSockets_server.Service;

public class WebSocketManager : IWebSocketManager
{
    private Dictionary<string, List<WebSocket>> SocketGroups { get; set; } = new ();

    public async Task<bool> AddSocketToGroup(WebSocket socket, string userID)
    {
        if (!SocketGroups.ContainsKey(userID))
        {
            SocketGroups[userID] = new List<WebSocket>();
        }

        var socketsForUser = SocketGroups[userID];

        var existingSocket = socketsForUser.FirstOrDefault(s => s == socket);
        
        if (existingSocket != null)
        {
            await existingSocket.CloseAsync(WebSocketCloseStatus.NormalClosure,"close", default);
        }
        
        SocketGroups[userID].Add(socket);
        
        return true;
    }
    

    public List<WebSocket> FindTargetedUser(List<User> users)
    {
        List<WebSocket> targetUsers = new();
        
        foreach (var user in users)
        {
            
            if (SocketGroups.ContainsKey(user.Id))
            {
                foreach (var socket in SocketGroups[user.Id])
                {
                    if (socket.State == WebSocketState.Open)
                    {
                        targetUsers.Add(socket);
                    }
                }
            }
        }
        
        return targetUsers;
    }

    public void RemoveSocket(WebSocket socket)
    {
        foreach (var group in SocketGroups.Values)
        {
            if (group.Contains(socket))
            {
                group.Remove(socket);
                if (group.Count == 0)
                {
                    var key = SocketGroups.FirstOrDefault(x => x.Value == group).Key;
                    SocketGroups.Remove(key);
                }
                break;
            }
        }
    }
}