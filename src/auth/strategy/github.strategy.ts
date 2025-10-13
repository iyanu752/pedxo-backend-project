import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const fullName = profile._json?.name || profile.username;

    let firstName = fullName;
    let lastName = '';
    if (fullName.includes(' ')) {
      const parts = fullName.split(' ');
      firstName = parts.shift() || '';
      lastName = parts.join(' ') || '';
    }

    const user = {
      provider: 'github',
      id: profile.id,
      firstName,
      lastName,
      email: profile.emails?.[0]?.value || null,
      accessToken,
      profilePic: profile._json?.avatar_url || null,
    };

    done(null, user);
  }
}
