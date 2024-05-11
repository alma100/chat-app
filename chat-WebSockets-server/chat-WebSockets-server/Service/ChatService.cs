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
            var messageObject = new WebSocketObj();
            if(message != "")
            {
                messageObject = JsonSerializer.Deserialize<WebSocketObj>(message);
            }
            
            
            if (messageObject.Event == "connection request")
            { 
                Console.WriteLine("asd"); 
                await _webSocketManager.AddSocketToGroup(socket, messageObject.UserId);
                var initRes = new { message = "connection opend" };
                string jsonInitRes = JsonSerializer.Serialize(initRes);
                byte[] initResBuffer = Encoding.UTF8.GetBytes(jsonInitRes);
                await socket.SendAsync(initResBuffer, WebSocketMessageType.Text, true, CancellationToken.None);

            }
            else if(messageObject.Event == "message")
            {
                if (messageObject.Message != null)
                {
                    Console.WriteLine($"Message {messageObject.Message}");
                }
                else
                {
                    Console.WriteLine("Message is null.");
                }
                await handleMessage(messageObject, result, buffer);
            }
            else if (messageObject.Event == "add emoji")
            {
                //add emoji to database
                Console.WriteLine("add emoji");
                await handleMessage(messageObject, result, buffer);
            }
            else if (messageObject.Event == "remove emoji")
            {
                await handleMessage(messageObject, result, buffer);
            }

            Array.Clear(buffer, 0, buffer.Length);
        }
       _webSocketManager.RemoveSocket(socket);
    }
    
    private async Task SendMessageToGroup(List<WebSocket> targetUsers, byte[] message)
    {
        
        foreach (var user in targetUsers)
        {
            Console.WriteLine("message counter");
            await user.SendAsync(message, WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }

    private async Task handleMessage(WebSocketObj messageObject,  WebSocketReceiveResult? result, byte[] buffer)
    {
        var chatId = messageObject.Message.ChatId;
        var users = _userRepository.GetUserByChatId(chatId);
        var targetusers = _webSocketManager.FindTargetedUser(users);

        //SaveMessage(messageObject);
        await SendMessageToGroup(targetusers, buffer[..result.Count]);
    }

    private void SaveMessage(Message message)
    {
        _messageRepository.AddMessage(message);
        
    }
}