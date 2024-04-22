using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using chat_WebSockets_server.Model;

namespace chat_WebSockets_server.Service;

public class WebSocketManager : IWebSocketManager
{
    private Dictionary<string, List<WebSocket>> SocketGroups { get; } = new ();

    public bool AddSocketToGroup(WebSocket socket, string userID)
    {
        /*if (!SocketGroups.ContainsKey(userID))
        {
            SocketGroups[userID] = new List<WebSocket>();
        }
        SocketGroups[userID].Add(socket);*/

        var isContains = false;
        foreach (var id in SocketGroups.Keys)
        {
            Console.WriteLine($"directUSERID {id} : {userID}");
            if (id == userID)
            {
                isContains = true;
            }
            
        }

        if (!isContains)
        {
            SocketGroups[userID] = new List<WebSocket>();
        }
        SocketGroups[userID].Add(socket);

        foreach (var VARIABLE in SocketGroups)
        {
            Console.WriteLine($"key: {VARIABLE.Key} : {VARIABLE.Value.Count}");
            foreach (var webSocket in VARIABLE.Value)
            {
                Console.WriteLine(webSocket.State);
                Console.WriteLine(webSocket.SubProtocol);
                Console.WriteLine(webSocket.CloseStatusDescription);
            }
        }
        Console.WriteLine($"socket in group: {SocketGroups.Count} after add socket");
        return true;
    }
    

    public List<WebSocket> FindTargetedUser(List<User> users)
    {
        List<WebSocket> targetUsers = new();
        
        foreach (var user in users)
        {
            
            if (SocketGroups.ContainsKey(user.Id))
            {
                targetUsers.AddRange(SocketGroups[user.Id]);
            }
        }
        
        return targetUsers;
    }
}