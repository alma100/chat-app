using chat_WebSockets_server.Model;
using chat_WebSockets_server.Repository;
using chat_WebSockets_server.Repository.UserRepository;

namespace chat_WebSockets_server.Service;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;


public class ChatService : IChatService
{
    
    
    private IMessageRepository _messageRepository;

    private IUserRepository _userRepository;

    private IWebSocketManager _webSocketManager;

    public ChatService(IMessageRepository messageRepository, IUserRepository userRepository, IWebSocketManager webSocketManager)
    {
        _messageRepository = messageRepository;
        _userRepository = userRepository;
        _webSocketManager = webSocketManager;
    }

    public async Task HandleWebSocketConnection(WebSocket socket)
    {
        var buffer = new byte[1024 * 2];
        while (socket.State == WebSocketState.Open)
        {
            var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), default);
            var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
            Console.WriteLine($"üzenet: {message}");
            var messageObject = new Message();
            if (message == null)
            {
                Console.WriteLine("null üzenet");
            }
            if (message == "")
            {
                Console.WriteLine(socket);
                Console.WriteLine("üres üzenet");
            }
            else
            {
                messageObject = JsonSerializer.Deserialize<Message>(message);
            }
            
            //messageObject = JsonSerializer.Deserialize<Message>(message);
            
            
            if (messageObject.Content == "connection request")
            { 
                Console.WriteLine("asd"); 
                _webSocketManager.AddSocketToGroup(socket, messageObject.UserId);
                var initRes = new { message = "connection opend" };
                string jsonInitRes = JsonSerializer.Serialize(initRes);
                byte[] initResBuffer = Encoding.UTF8.GetBytes(jsonInitRes);
                await socket.SendAsync(initResBuffer, WebSocketMessageType.Text, true, CancellationToken.None);

            }
            else
            {
                var chatId = messageObject.ChatId;
                //_webSocketManager.AddSocketToGroup(socket, messageObject.UserId);
                var users = _userRepository.GetUserByChatId(chatId);
                var targetusers = _webSocketManager.FindTargetedUser(users);

                if (result.MessageType == WebSocketMessageType.Close)
                {

                    await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, default);
                    break;
                }

                //SaveMessage(messageObject);
                await SendMessageToGroup(targetusers, buffer[..result.Count]);
            }

            Array.Clear(buffer, 0, buffer.Length);
        }
        //_sockets.Remove(socket);
    }

   


    /*private void AddToSocketToDictionary(string userId, WebSocket socket)
    {
        Console.WriteLine("-------------------------------------------------");
        Console.WriteLine($"username: {userId} add to the directory");
        Console.WriteLine($"socket in group: {SocketGroups.Count} before add socket");
        if (SocketGroups.ContainsKey(userId))
        {
            SocketGroups[userId].Add(socket);
        }
        else
        {
            Console.WriteLine($"add: {userId}");
            SocketGroups.Add(userId, new List<WebSocket>{socket});
            
        }
        Console.WriteLine($"socket in group: {SocketGroups.Count} after add socket");
    }*/
    
    
    private async Task SendMessageToGroup(List<WebSocket> targetUsers, byte[] message)
    {
        
        foreach (var user in targetUsers)
        {
            Console.WriteLine("message counter");
            await user.SendAsync(message, WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }

    private void SaveMessage(Message message)
    {
        _messageRepository.AddMessage(message);
        
    }
}