
namespace Application.User
{
    public class FaceBookUserInfo
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public FaceBookPictureData Picture { get; set; }
    }

    public class FaceBookPictureData
    {
        public FaceBookPicture Data { get; set; }
    }

    public class FaceBookPicture
    {
        public string Url { get; set; }
    }
}