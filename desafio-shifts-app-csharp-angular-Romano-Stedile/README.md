# Desafio MedSimples - Shifts App (App de agendamentos de plantões)

## Contexto
A MedSimples contratou um desenvolvedor terceiro para implementar um sistema básico de agendamento de plantões para médicos. Foi dado a esse desenvolvedor uma especificação escrita (veja abaixo ) do que precisava ser desenvolvido e entregue. No entanto, após a entrega a equipe de negócio encontrou diversos problemas nas funcionalidades do sistema, além de funcionalidade que não tinham sido implementadas. Além disso, o head de engenharia pontuou que o sistema não está pronto para produção e nem para que a equipe da MedSimples continue seu desenvolvimento de maneira estruturada, seguindo as melhores práticas.

Veja abaixo alguns comentários da equipe da MedSimples sobre o sistema:
> "Cada coisa é feita de um jeito, como está hoje é insustentável implementar melhorias. Não temos uma base sólida no projeto. Sem contar que a segurança me preocupa." -- Tech Lead

> "Ao usar o sistema, algumas coisas não funcionam e eu fico sem saber o porquê." -- Stakeholder

> "Quando perguntei ao desenvolver como faço para mudar as especialidades ele me disse que 'é só abrir um chamado que ele atualiza'. Não podemos depender disso, o sistema será implementado em vários clientes! Os nossos clientes precisam poder usar o sistema sem depender de nós." -- Gerente do projeto

> "Eu achei a parte de relatórios meio estranha, hoje tirei um report e o valor total estava menor do que na semana passada, que continha menos plantões." -- Stakeholder

> "É importante as informações do sistema estarem válidas, os pagamentos serão enviados a partir dele." -- Gerente do projeto


Foi dada e você, dev, a missão de organizar o sistema e corrigir os problemas de implementação para que a MedSimples possa realizar a entrega em produção e sua equipe continue com o desenvolvimento de maneira sustentável.


## Especificação da aplicação
A aplicação é um sistema web que deve possuir cadastro de médicos, hospitais, e a possibilidade de adicionar plantões dos médicos nos hospitais. Como cada plantão tem especialidades especificas, é necessário que tenha como configurar fácilmente um valor hora para as especialidades em cada um dos hospitais.

### Funcionalidades
- Cadastro de médicos
  - Tela para cadastro, edição e exclusão de médicos;
  - Campos
    - Nome
    - CPF
    - CRM
    - Email
    - Telefone
    - Endereço
  - Regras
    - Não se pode ter médicos com o mesmo CPF, ou CRM, ou email, ou telefone;
    - É necessário saber quando um médico foi cadastrado e quando foi atualizado pela última vez;
    - Um médico que possui plantões não deve ser excluído para que seja possível manter o histórico. O usuário deve estar ciente do motivo da impossibilidade de exclusão;
- Cadastro de hospitais
  - Tela para cadastro, edição e exclusão de hospitais;
  - Campos
    - Nome
    - Endereço
  - Regras
    - Não se pode ter hospitais com o mesmo nome;
    - É necessário saber quando um hospital foi cadastrado e quando foi atualizado pela última vez;
    - Um hospital que possui plantões não deve ser excluído para que seja possível manter o histórico. O usuário deve estar ciente do motivo da impossibilidade de exclusão;
- Configuração de valor-hora
  - Possibilidade de configurar o valor-hora para cada especialidade junto das informações do hospital;
  - Possibilidade de ter um valor-hora padrão para cada hospital, que será utilizado quando um plantão não tiver especialidade ou a especialidade do plantão não tiver valor-hora cadastrado em dado hospital.
  - Campos
    - Especialidade
    - Hospital
    - Valor-hora
  - Regras
    - O valor-hora deve ser único para cada especialidade de um hospital;
    - Não é obrigatória a configuração de valor-hora para as especialidades do hospital;
- Configuração de especialidades
  - Ter uma configuração de especialidades no sistema, onde seja possível adicionar e remover especialidades dessa lista a qualquer momento.
  - Campos
    - Nome
  - Regras
    - A remoção de uma especialidade não deve afetar plantões existentes;
    - Ao remover uma especialidade, os valores-hora relacionados a mesma devem ser removidos em todos os hospitais;
- Cadastro de plantões
  - Possibilidade de adicionar, editar e remover plantões;
  - Tela para a visualização dos plantões;
  - Configuração global na aplicação para poder configurar o SLOT_TIME do plantão, ou seja, a fração mínima de tempo em que os plantões podem alocar. Esta fração deve ser de no mínimo 5 minutos e no máximo 2 horas.
  Por exemplo, se o SLOT_TIME for de 30 minutos, só poderão ser criados plantões em passos de 30 minutos, então um plantão poderá ter as seguintes durações [30m, 1h, 1h30m, 2h, 2h30m, 3h, ...];
  - Configuração global na aplicação para poder configurar o MAX_DOCTOR_DAY_SHIFTS, ou seja, o número máximo de plantões que um médico pode ter em um dia específico. Importante, conta como plantão no dia qualquer plantão que ocupe horas desse dia. Exemplos com a configuração de MAX_DOCTOR_DAY_SHIFTS igual a 2:
    - Um médico tem um plantão inciando no dia 01 às 22h e finalizando no dia 02 às 06h, e um segundo plantão iniciando no dia 02 às 12h e finalizando no dia 02 às 18h, este médico não poderá mais ser alocado em nenhum plantão no dia 02.
    - Um outro médico tem um plantão no dia 01 das 06h às 12h e um segundo plantão no mesmo dia das 14h às 18h, nesse caso o médico também não poderá ser alocado em mais nenhum plantão no dia 01.
  - Campos
    - Médico
    - Hospital
    - Especialidade
    - Data
    - Início
    - Fim
  - Regras
    - Um médico não poderá ter mais de 12h em plantões em um mesmo dia;
    - Um médico não poderá ter mais de 2 plantões em um mesmo dia;
    - Plantões não podem ser menor que 1 hora;
    - Plantões não podem ser maiores que 12 horas;
    - O SLOT_TIME deve ser de no mínimo 5 minutos e no máximo 2 horas.
    - Caso o SLOT_TIME for maior que 1 hora, um plantão não deve ser menor que o SLOT_TIME;
    - Ao modificar o parâmetro MAX_DOCTOR_DAY_SHIFTS, é possível que plantões futuros já cadastrados se tornem inválidos. Nesse caso, é necessário sinalizar esses plantões como inválidos no banco de dados. Essa sinalização deve permitir que a equipe de operações visualize os plantões inválidos e tome as devidas ações, como cancelar ou reagendar os plantões com os médicos, ou ainda, trocar o médico do plantão, por exemplo.
    - Os dados de plantões retroativos não poderão ser modificados já que serão usados em relatórios;
- Relatório financeiro
  - Deve ser possível exportar em CSV relatórios contendo o custo dos plantões de determinados hospitais em determinado período.
  - Regras
    - Não deve ser possível exportar relatórios com data futura.
    - Apenas plantões iniciados em determinado dia devem ser considerados para as datas de inicio e fim.


### Tecnologias
- .NET 9.0
- C#
- MS SqlServer 2022
- Angular 18
- Tailwind CSS
- Docker

## O Que Precisa Ser Feito?
Como dito anteriormente sua missão será entender a implementação feita pelo terceiro e corrigir todo o necessário para que os requisitos especificados acima sejam atendidos. Os problemas com a estruturação do projeto e requisitos não funcionais também devem ser ajustados, tendo em vista que a suposta equipe da MedSimples continuará com o desenvolvimento do sistema, mas considera a manutenção e evolução inviável no estado atual do projeto.


Abra uma pull request com a implementção do requisito e as modifições que vocè acredita que devem ser realizadas

Obs: A primeira versão criada pelo terceiro pode conter falhas de implementação, você deve revisar e corrigir eventuais problemas existentes.

## Pré-Requisitos para o desenvolvimento
- Docker
- Node.js
- .NET 9.0
- SQL server(express, dev ou docker)

## Dependências Utilizadas
- Entity Framework
- NUnit
- XUnit
- Angular

## Subindo a aplicação
- API
  - Configure a Connection String da base de dados no appsettings da aplicação;
  - Caso necessário escolha o projeto API como Startup Project;
  - Inicie a aplicação pelo dotnet cli ou Visual Studio;
- Frontend
  ```
  npm install
  npm run dev
  ```

## Restrições
- As dependências inicias e ORM deverão ser mantidas na implementação;
- É livre a instalação de bibliotecas adicionais e mudanças na organização do projeto;
- Alterações na estrutura das tabelas do banco de dados devem ser versionadas em migrations;
- A base de dados MS SQL Server deve ser mantida;
- Manter a stack de implementação da API em .NET(C#) e do frontend em Angular(Typescript);

## Avaliação
O objetivo da avaliação é focar na funcionalidade, organização, design da aplicação e testes, em vez da estética e estilização. Sinta-se à vontade para estilizar conforme preferir, mas isso não será considerado um critério relevante na avaliação.
A ideia do desafio é avaliar a implementação e realizar ajustes corrigindo problemas funcionais e não funcionais (segurança por exemplo) da aplicação.

Serão avaliados os seguintes critérios:
- Design e decisão arquiteturas e patterns adotados;
- Cumprimento dos requisitos funcionais e das regras de negócio, incluindo detalhes e validações não explicitamente descritos (será avaliado o senso crítico do desenvolvedor). Cumprimento dos requisitos não funcionais, que também não estão explicitamente descritos, exigindo do desenvolvedor a identificação e implementação desses requisitos com base em seu senso crítico.
- Implementação de testes automatizados;
- O código está legível (variáveis e funções com nomes adequados, organização, boas práticas, etc.);
- Mensagem dos commits;


## IMPORTANTE
Ao submeter a solução, você confirma que ela é produto do seu próprio trabalho, exceto onde indicado de forma clara. Além disso, você assegura que a implementação e entrega da solução não infringe nenhuma licença.


---

A equipe da MedSimples deseja um ótimo desafio!

MedSimples - 2025
