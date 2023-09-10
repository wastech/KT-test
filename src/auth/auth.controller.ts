import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  HttpException,
  Put,
  Req,
  Request,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'; // Import necessary decorators
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from '../common/decorators/public.decorator';
import { Auth } from './entities/auth.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from 'src/common/roles.guard';


@ApiTags('Authentication') // Add an API tag
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Defines a new route for user registration.
   * @param {CreateAuthDto} createAuthDto - The data for creating a new user account.
   * @returns {Promise<{ user: Auth }>} The newly created user account.
   */
  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' }) // Add an operation summary
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: Auth,
  })
  async register(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<{ user: Auth }> {
    console.log(Auth);
    const user = await this.authService.register(createAuthDto);
    return { user };
  }

  /**
Logs in a user and returns a JWT token if the login credentials are valid.
@param {LoginUserDto} loginUserDto - The DTO containing the user's login credentials.
@returns {Object} An object containing the JWT token.
@throws {HttpException} If the login credentials are invalid.
*/
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Log in user' }) // Add an operation summary
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Invalid login credentials' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    if (!loginUserDto) {
      throw new HttpException('Invalid request body', HttpStatus.BAD_REQUEST);
    }

    const token = await this.authService.login(loginUserDto);
    if (!token) {
      throw new HttpException(
        'Invalid login credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return { token };
  }

  /**
   * Returns the authenticated user's profile.
   * @param {Request} req - The request object containing the authenticated user's information.
   * @returns {Object} An object representing the authenticated user's profile.
   */
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' }) // Add an operation summary
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: Auth,
  }) // Define your Profile type
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getProfile(@Request() req): Auth {
    return req.user; // Assuming req.user contains user information from JWT payload
  }

  @Put(':id')
  @ApiBearerAuth()
   @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update user' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
   @Roles(Role.Admin, Role.Agent)
  async updateUser(
    @Param('id') id: string,
    @Body() UpdateAuthDto: any,
    @Req() req,
  ) {
    const userId = id;

    return this.authService.updateUser(userId, UpdateAuthDto, req.user._id);
  }

  /**
   * Updates user password if old password is correct.
   * @param {string} oldPassword - The user's current password.
   * @param {string} newPassword - The user's desired new password.
   * @param {Request} req - The request object.
   * @returns {Promise<any>} A promise that resolves to the result of the update operation.
   */
  @ApiOperation({ summary: 'Update user' })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Patch('update-password')
  @ApiBearerAuth()
  async changePassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    // Call the changePassword method on the AuthService
    const result = await this.authService.updateUserPassword(
      userId,
      oldPassword,
      newPassword,
    );

    return result;
  }
}