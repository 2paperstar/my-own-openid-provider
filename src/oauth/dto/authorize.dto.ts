import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

const allowedScopes = [
  'openid',
  'profile',
  'email',
  'phone',
  'address',
] as const;
type Scope = (typeof allowedScopes)[number];

export class AuthorizeDto {
  @IsString({ message: 'invalid_request' })
  client_id: string;

  @IsString()
  @IsUrl(
    {
      require_valid_protocol: false,
      require_tld: false,
      require_host: false,
    },
    { message: 'invalid_request' },
  )
  redirect_uri: string;

  @IsString({ message: 'invalid_request' })
  @IsOptional()
  nonce?: string;

  @IsArray()
  @IsEnum(allowedScopes, { each: true, message: 'invalid_scope' })
  @Transform(({ value }) => value.split(' '))
  scope: Readonly<Scope[]>;

  @IsArray()
  @IsEnum(['code', 'token', 'id_token'], {
    each: true,
    message: 'unsupported_response_type',
  })
  @Transform(({ value }) => value.split(' '))
  response_type: ('code' | 'token' | 'id_token')[];

  @IsString()
  @IsOptional()
  state?: string;
}
