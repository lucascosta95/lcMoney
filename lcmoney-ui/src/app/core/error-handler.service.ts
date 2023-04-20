import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotAuthenticatedError } from '../seguranca/money-http-interceptor';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private messageService: MessageService,
    private route: Router, 
    ) { }

  handle(errorResponse: any) {
    let msg: string;

    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    } 
    else if (errorResponse instanceof NotAuthenticatedError){
      msg = 'Sua sessão expirou!'; 
      this.route.navigate(['/login']);
    }
    else if (
      errorResponse instanceof HttpErrorResponse &&
      errorResponse.status >= 400 &&
      errorResponse.status <= 499
    ) {
      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if(errorResponse.status === 403)
      msg = 'Você não possui permissão para executar esta ação.'

      try {
        msg = errorResponse.error[0].mensagemUsuario;
      } catch (e) {}
      console.error('Ocorreu um erro', errorResponse);

    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      console.error('Ocorreu um erro', errorResponse);
    }

    this.messageService.add({ severity: 'error', detail: msg });
  }
}
