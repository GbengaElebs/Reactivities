using System.Threading.Tasks;
using Application.User;

namespace Application.Interfaces
{
    public interface IFaceBookAcessor
    {
           Task<FaceBookUserInfo> FaceBookLogin (string accessToken);
    }
}