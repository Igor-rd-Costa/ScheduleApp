using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ScheduleAppBackend.Models;

namespace ScheduleAppBackend.Context
{
    public class UserStore : IUserStore<User>, IUserPasswordStore<User>, IUserEmailStore<User>
    {
        private readonly ScheduleAppContext m_Context;

        public UserStore(ScheduleAppContext context)
        {
            m_Context = context;
        }

        public Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                var result = m_Context.Users.Add(user);
                if (result.State == EntityState.Added)
                {
                    m_Context.SaveChanges();
                    return IdentityResult.Success;
                }
                return IdentityResult.Failed();
            });
        }

        public Task<IdentityResult> DeleteAsync(User user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            
        }

        public Task<User?> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                return m_Context.Users.Where(user => user.Email == normalizedEmail).FirstOrDefault();
            });
        }

        public Task<User?> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                return m_Context.Users.Where(user => user.Id == int.Parse(userId)).FirstOrDefault();
            });
        }

        public Task<User?> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                return m_Context.Users.Where(user => user.FirstName == normalizedUserName).FirstOrDefault();
            });
        }

        public Task<string?> GetEmailAsync(User user, CancellationToken cancellationToken)
        {
            return Task<string?>.Factory.StartNew(() => user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(User user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => user.IsEmailConfirmed);
        }

        public Task<string?> GetNormalizedEmailAsync(User user, CancellationToken cancellationToken)
        {
            return Task<string?>.Factory.StartNew(() => user.Email);
        }

        public Task<string?> GetNormalizedUserNameAsync(User user, CancellationToken cancellationToken)
        {
            return Task<string?>.Factory.StartNew(() => user.FirstName);
        }

        public Task<string?> GetPasswordHashAsync(User user, CancellationToken cancellationToken)
        {
            return Task<string?>.Factory.StartNew(() => user.Password);
        }

        public Task<string> GetUserIdAsync(User user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => user.Id.ToString());
        }

        public Task<string?> GetUserNameAsync(User user, CancellationToken cancellationToken)
        {
            return Task<string?>.Factory.StartNew(() =>
            {
                return user.FirstName;
            });
        }

        public Task<bool> HasPasswordAsync(User user, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                return user.Password != string.Empty;
            });
        }

        public Task SetEmailAsync(User user, string? email, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => user.Email = email ?? "");
        }

        public Task SetEmailConfirmedAsync(User user, bool confirmed, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => user.IsEmailConfirmed = confirmed);
        }

        public Task SetNormalizedEmailAsync(User user, string? normalizedEmail, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => {});
        }

        public Task SetNormalizedUserNameAsync(User user, string? normalizedName, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => { });
        }

        public Task SetPasswordHashAsync(User user, string? passwordHash, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() =>
            {
                user.Password = passwordHash!;
            });
        }

        public Task SetUserNameAsync(User user, string? userName, CancellationToken cancellationToken)
        {
            return Task.Factory.StartNew(() => user.FirstName = userName ?? "");
        }

        public Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
