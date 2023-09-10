import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from 'src/auth/entities/auth.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Retrieves all users in the system. Requires admin role.
   * @returns {Promise<Auth[]>} A list of all users in the system.
   * @throws {UnauthorizedException} If the user does not have admin role.
   */
  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Retrieve all users (Admin role required)' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: Auth,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized or insufficient permissions',
  })
  async findAll(
    @Query('page') page: number = 1, // Default to page 1 if not specified
    @Query('pageSize') pageSize: number = 10, // Default to 10 items per page if not specified
  ) {
    const { users, total } = await this.userService.findAll(page, pageSize);
    return {
      users,
      total,
      page,
      pageSize,
    };
  }

  /**
   * Deletes a user by ID.
   * @param {Request} req - The request object.
   * @param {string} userId - The ID of the user to delete.
   * @returns {Object} An object with a success message.
   * @throws {UnauthorizedException} If the user is not authorized to delete users.
   */
  @Delete(':userId')
  @ApiOperation({ summary: 'Delete a user (Admin role required)' })
  @ApiBadRequestResponse({ description: 'Invalid user ID' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized or insufficient permissions',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async deleteUser(@Request() req, @Param('userId') userId: string) {
    const deletedUser = await this.userService.deleteUser(
      userId,
      req.user.role,
    );
    return {
      message: `User ${deletedUser.fullname} has been deleted successfully!`,
    };
  }

  // Retrieves a user by their ID
  // @param {string} id - The ID of the user to retrieve
  // @returns {Promise<Auth>} The user with the specified ID
  // @throws {NotFoundException} If the user with the specified ID is not found
  @Get(':id') // Defines a new route with a dynamic parameter "id"
  @ApiOperation({ summary: 'Get user by ID (Admin or Guest role required)' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: Auth,
  })
  @ApiBadRequestResponse({ description: 'Invalid user ID' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized or insufficient permissions',
  })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.Agent) // Allows both admin and regular users to access this route
  async getUser(@Param('id') id: string): Promise<Auth> {
    return this.userService.getUser(id); // Calls the "getUser" method in the "AuthService" and returns the result
  }
}
