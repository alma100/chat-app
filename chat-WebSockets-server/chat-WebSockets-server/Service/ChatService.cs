using chat_WebSockets_server.Model;
using chat_WebSockets_server.Repository;

namespace chat_WebSockets_server.Service;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;


public class ChatService : IChatService
{
    private readonly Dictionary<string, List<WebSocket>> _socketGroups = new ();

    private IMessageRepository _messageRepository;

    public ChatService(IMessageRepository messageRepository)
    {
        _messageRepository = messageRepository;
    }

    public async Task HandleWebSocketConnection(WebSocket socket)
    {
       
        var buffer = new byte[1024 * 2];
        while (socket.State == WebSocketState.Open)
        {
            var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), default);
            var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
            Console.WriteLine(message);
            var messageObject = JsonSerializer.Deserialize<Message>(message);
            
            Console.WriteLine(messageObject.ChatId);
            Console.WriteLine(messageObject.UserId);
            Console.WriteLine(messageObject.Content);
            var chatId = messageObject.ChatId;
        
            
            AddSocketToGroup(chatId, socket);
            if (result.MessageType == WebSocketMessageType.Close)
            {
                
                await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, default);
                break;
            }

            SaveMessage(messageObject);
            await SendMessageToGroup(chatId, buffer[..result.Count]);
        }
        //_sockets.Remove(socket);
    }
    
    private void AddSocketToGroup(string groupName, WebSocket socket)
    {
        if (!_socketGroups.ContainsKey(groupName))
        {
            _socketGroups[groupName] = new List<WebSocket>();
            _socketGroups[groupName].Add(socket);
        }
    
        
    }
    
    private async Task SendMessageToGroup(string groupName, byte[] message)
    {
        if (_socketGroups.ContainsKey(groupName))
        {
            var sockets = _socketGroups[groupName];
            foreach (var socket in sockets)
            {
                await socket.SendAsync(message, WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
    }

    private void SaveMessage(Message message)
    {
        _messageRepository.AddMessage(message);
        
    }
}