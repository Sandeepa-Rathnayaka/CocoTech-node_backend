import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { asyncHandler } from '../middleware/errorHandler';

export default class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getUsers = asyncHandler(async (req: Request, res: Response) => {
        const users = await this.userService.getAllUsers();
        res.status(200).json({
            status: 'success',
            data: { users }
        });
    });

    getUserById = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userService.getUserById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: { user }
        });
    });

    createUser = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userService.createUser(req.body);
        res.status(201).json({
            status: 'success',
            data: { user }
        });
    });

    updateUser = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.userService.updateUser(req.params.id, req.body);
        res.status(200).json({
            status: 'success',
            data: { user }
        });
    });

    deleteUser = asyncHandler(async (req: Request, res: Response) => {
        await this.userService.deleteUser(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    });
}