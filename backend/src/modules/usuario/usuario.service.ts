import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ListUsuarioDto } from './dto/list-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {

    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        private readonly jwtService: JwtService,
    ) {}

    async create(createUsuarioDto: CreateUsuarioDto) {
        const usuario = this.usuarioRepository.create(createUsuarioDto);
        return await this.usuarioRepository.save(usuario);
    }

    async findAll(listUsuarioDto: ListUsuarioDto) {
        return await this.usuarioRepository.find({
            where: listUsuarioDto,
        });
    }

    async findOne(id: number) {
        const usuario = await this.usuarioRepository.findOne({ where: { id } });
        if (!usuario) {
            throw new Error(`Usuário com ID ${id} não encontrado`);
        }
        return usuario;
    }

    async findByUsuario(usuario: string) {
        const user = await this.usuarioRepository.findOne({ where: { usuario } });
        if (!user) {
            throw new Error(`Usuário ${usuario} não encontrado`);
        }
        return user;
    }

    async findByPerfil(perfil: number) {
        const users = await this.usuarioRepository.find({ where: { perfil } });
        if (users.length === 0) {
            throw new Error(`Nenhum usuário encontrado com perfil ${perfil}`);
        }
        return users;
    }

    async login(usuario: string, senha: string) {
        const user = await this.usuarioRepository.findOne({ where: { usuario } });
        if (!user || user.senha !== senha) {
            throw new UnauthorizedException('Usuário ou senha inválidos');
        }
        const payload = { sub: user.id, usuario: user.usuario, perfil: user.perfil };
        return { access_token: this.jwtService.sign(payload) };
    }

    async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
        const usuario = await this.findOne(id);
        const updatedUsuario = Object.assign(usuario, updateUsuarioDto);
        return await this.usuarioRepository.save(updatedUsuario);
    }

    async remove(id: number) {
        await this.findOne(id);
        await this.usuarioRepository.delete(id);
        return { id };
    }

}
