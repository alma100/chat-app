using chat_WebSockets_server.Model;
using chat_WebSockets_server.Repository;
using chat_WebSockets_server.Repository.UserRepository;

namespace chat_WebSockets_server.Service;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;


public class ChatService : IChatService
{
    private readonly IMessageRepository _messageRepository;

    private readonly IUserRepository _userRepository;

    private readonly IWebSocketManager _webSocketManager;

    private readonly ILogger<IChatService> _logger;

    public ChatService(IMessageRepository messageRepository, IUserRepository userRepository, IWebSocketManager webSocketManager, ILogger<IChatService> logger)
    {
        _messageRepository = messageRepository;
        _userRepository = userRepository;
        _webSocketManager = webSocketManager;
        _logger = logger;
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
                    CreatedAt = DateTime.UtcNow,
                    Message = null,
                    UserId = "server"
                };
                
                string jsonInitRes = JsonSerializer.Serialize(initRes);
                byte[] initResBuffer = Encoding.UTF8.GetBytes(jsonInitRes);
                
                _logger.LogInformation($"User ID:{messageObject.UserId} joined to the server at: {DateTime.UtcNow}");
                
                await socket.SendAsync(initResBuffer, WebSocketMessageType.Text, true, CancellationToken.None);

            }
            else if(messageObject.Event == "message")
            {
                await HandleMessage(messageObject, "message");
            }
            else if (messageObject.Event == "add emoji")
            {
                await HandleMessage(messageObject, "add emoji");
            }
            else if (messageObject.Event == "remove emoji")
            {
                await HandleMessage(messageObject, "remove emoji");
            }

            Array.Clear(buffer, 0, buffer.Length);
        }
        
        var key = _webSocketManager.RemoveSocket(socket);
        
        _logger.LogInformation($"user ID: {key}, {socket} removed");
    }
    
    private async Task SendMessageToGroup(Dictionary<string, WebSocket> targetUsers,  WebSocketObj messageObject)
    {
        var jsonMessage = JsonSerializer.Serialize(messageObject);
        
        var jsonBytes = Encoding.UTF8.GetBytes(jsonMessage);

        foreach (var user in targetUsers)
        {
            try
            {
                await user.Value.SendAsync(jsonBytes, WebSocketMessageType.Text, true, CancellationToken.None);
                
                _logger.LogInformation($"message ID:{messageObject.Message.MessageId} send to user ID:{user.Key} at: {DateTime.UtcNow}");
            }
            catch (Exception e)
            {
                _logger.LogError(e, $"Try to send message ID: {messageObject.Message.MessageId} to user ID:{user.Key}, but unexpected error occured: {e} at: {DateTime.UtcNow}");
                throw;
            }
            
        }
    }

    private async Task HandleMessage(WebSocketObj messageObject, string eventType)
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
        try
        {
            var result = await _messageRepository.AddMessage(message);
            
            _logger.LogInformation($"message ID:{message.MessageId} saved to database at: {DateTime.UtcNow}");
            
            return result;
        }
        catch (Exception e)
        {
            _logger.LogError($"Try to save message ID:{message.MessageId} to database, but unexpected error occured: {e} at: {DateTime.UtcNow}");
            throw;
        }
        
    }
    
    private async Task<Message>UpdateMessageEmoji(Message message)
    {
        try
        {
            var result = await _messageRepository.UpdateMessageEmoji(message);
            
            _logger.LogInformation($"message ID:{message.MessageId} emoji list updated at: {DateTime.UtcNow}");

            return result;
        }
        catch (Exception e)
        {
            _logger.LogError($"Try to emoji list updated message ID:{message.MessageId}, but unexpected error occured: {e} at: {DateTime.UtcNow}");
            throw;
        }
        
    }
}