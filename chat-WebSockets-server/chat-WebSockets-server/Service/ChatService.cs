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
            var messageObject = new WebSocketObj();
            if(message != "")
            {
                messageObject = JsonSerializer.Deserialize<WebSocketObj>(message);
            }
            
            
            if (messageObject.Event == "connection request")
            { 
                await _webSocketManager.AddSocketToGroup(socket, messageObject.UserId);
                var initRes = new WebSocketObj
                {
                    Event = "connection request",
                    Content = "connection opend",
                    CreatedAt = DateTime.Now,
                    Message = null,
                    UserId = "server"
                };
                string jsonInitRes = JsonSerializer.Serialize(initRes);
                byte[] initResBuffer = Encoding.UTF8.GetBytes(jsonInitRes);
                await socket.SendAsync(initResBuffer, WebSocketMessageType.Text, true, CancellationToken.None);

            }
            else if(messageObject.Event == "message")
            {
                await handleMessage(messageObject, "message");
            }
            else if (messageObject.Event == "add emoji")
            {
                await handleMessage(messageObject, "add emoji");
            }
            else if (messageObject.Event == "remove emoji")
            {
                await handleMessage(messageObject, "remove emoji");
            }

            Array.Clear(buffer, 0, buffer.Length);
        }
        _webSocketManager.RemoveSocket(socket);
    }
    
    private async Task SendMessageToGroup(List<WebSocket> targetUsers,  WebSocketObj messageObject)
    {
        
        var jsonMessage = JsonSerializer.Serialize(messageObject);

        
        var jsonBytes = Encoding.UTF8.GetBytes(jsonMessage);

        foreach (var user in targetUsers)
        {
            await user.SendAsync(jsonBytes, WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }

    private async Task handleMessage(WebSocketObj messageObject, string eventType)
    {
        var chatId = messageObject.Message.ChatId;
        
        var users = _userRepository.GetUserByChatId(chatId);
        
        var targetusers = _webSocketManager.FindTargetedUser(users);

        var message = new Message();
        
        if (eventType == "message")
        {
            message = await SaveMessage(messageObject.Message);
        }
        else if (eventType == "add emoji" || eventType == "remove emoji")
        {
            message = await UpdateMessageEmoji(messageObject.Message);
        }
        
        messageObject.Message = message;
        
        await SendMessageToGroup(targetusers, messageObject);
    }

    private async Task<Message>SaveMessage(Message message)
    {
        return await _messageRepository.AddMessage(message);
    }
    
    private async Task<Message>UpdateMessageEmoji(Message message)
    {
        return await _messageRepository.UpdateMessageEmoji(message);
    }
}