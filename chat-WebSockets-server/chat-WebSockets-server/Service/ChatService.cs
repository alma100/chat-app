using chat_WebSockets_server.Model;
using chat_WebSockets_server.Repository;
using chat_WebSockets_server.Repository.UserRepository;

namespace chat_WebSockets_server.Service;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;


public class ChatService : IChatService
{
    //private readonly Dictionary<string, WebSocket> _socketGroups = new();
    
    public static Dictionary<string, WebSocket> SocketGroups { get; set; }

    private IMessageRepository _messageRepository;

    private IUserRepository _userRepository;

    public ChatService(IMessageRepository messageRepository, IUserRepository userRepository)
    {
        _messageRepository = messageRepository;
        _userRepository = userRepository;
        SocketGroups = new Dictionary<string, WebSocket>();
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
            if (messageObject.Content == "connection request")
            {
                Console.WriteLine("asd");
                AddToSocketToDictionary(messageObject.UserId, socket);
                var initRes = new { message = "connection opend" };
                string jsonInitRes = JsonSerializer.Serialize(initRes);
                byte[] initResBuffer = Encoding.UTF8.GetBytes(jsonInitRes);
                await socket.SendAsync(initResBuffer, WebSocketMessageType.Text, true, CancellationToken.None);

            }
            else
            {
                var chatId = messageObject.ChatId;
                var userId = messageObject.UserId;
                AddToSocketToDictionary(userId, socket);
                var targetusers = FindeTargetedUser(chatId);

                if (result.MessageType == WebSocketMessageType.Close)
                {

                    await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, default);
                    break;
                }

                SaveMessage(messageObject);
                await SendMessageToGroup(targetusers, buffer[..result.Count]);
            }

            Array.Clear(buffer, 0, buffer.Length);
        }
        //_sockets.Remove(socket);
    }

   


    private void AddToSocketToDictionary(string userId, WebSocket socket)
    {
        Console.WriteLine("-------------------------------------------------");
        Console.WriteLine($"username: {_userRepository.GetUserById(userId).FirstName}");
        if (!SocketGroups.ContainsKey(userId))
        {
            Console.WriteLine($"add: {userId}");
            SocketGroups.Add(userId, socket);
        }
    }
    private List<WebSocket> FindeTargetedUser(int chatId)
    {
        List<WebSocket> targetUsers = new();

        var users = _userRepository.GetUserByChatId(chatId);

        Console.WriteLine($"socket in group: {SocketGroups.Count}");
        foreach (var user in users)
        {
            if (SocketGroups.ContainsKey(user.Id))
            {
                targetUsers.Add(SocketGroups[user.Id]);
            }
        }
        
        return targetUsers;
    }
    
    private async Task SendMessageToGroup(List<WebSocket> targetUsers, byte[] message)
    {
        
        foreach (var user in targetUsers)
        {
            await user.SendAsync(message, WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }

    private void SaveMessage(Message message)
    {
        _messageRepository.AddMessage(message);
        
    }
}