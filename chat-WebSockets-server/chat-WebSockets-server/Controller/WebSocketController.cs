using System.Net.WebSockets;
using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace chat_WebSockets_server.WebSocketController;

public class WebSocketController : ControllerBase
{
    
    [Route("/ws")]
    public async Task Get()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            Console.WriteLine("asd");
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            await Echo(webSocket);
        }
        else
        {
            Console.WriteLine("asd1");
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }


    private static async Task Echo(WebSocket webSocket)
    {
        var buffer = new byte[1024 * 4];
        var receiveResult = await webSocket.ReceiveAsync(
            new ArraySegment<byte>(buffer), CancellationToken.None);

        while (!receiveResult.CloseStatus.HasValue)
        {
            var message = Encoding.UTF8.GetString(buffer, 0, receiveResult.Count);
            await SaveMessageToDatabase(message);
            
            await webSocket.SendAsync(
                new ArraySegment<byte>(buffer, 0, receiveResult.Count),
                receiveResult.MessageType,
                receiveResult.EndOfMessage,
                CancellationToken.None);

            receiveResult = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None);
        }

        await webSocket.CloseAsync(
            receiveResult.CloseStatus.Value,
            receiveResult.CloseStatusDescription,
            CancellationToken.None);
    }
    
    private static async Task SaveMessageToDatabase(string message)
    {
        // Adatbázis műveletek végrehajtása, pl. üzenet beszúrása az adatbázisba
        /*using (var dbContext = new YourDbContext())
        {
            dbContext.Messages.Add(new Message { Content = message, Timestamp = DateTime.Now });
            await dbContext.SaveChangesAsync();
        }*/
    }
}