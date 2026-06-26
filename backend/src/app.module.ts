import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComandaModule } from './modules/comanda/comanda.module';
import { MesaModule } from './modules/mesa/mesa.module';
import { ProdutoModule } from './modules/produto/produto.module';
import { ComandaItemModule } from './modules/comanda-item/comanda-item.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AuthModule } from './modules/auth/auth.module';
import ormConfig from './config/orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...ormConfig,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    ComandaModule,
    MesaModule,
    ProdutoModule,
    ComandaItemModule,
    UsuarioModule,
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!,
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '8h') as any },
      }),
      inject: [ConfigService],
      global: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
