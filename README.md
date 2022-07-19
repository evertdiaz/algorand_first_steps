# Primeros pasos
- Agregar al docker-compose la ruta donde estarán tus archivos
```
volumes:
- type: bind
  source: ../
  target: /data
```

### Sandbox commands
- `./sandbox up -v` - Levantar sandbox
- `./sandnbox down` - Apagar sandbox
- `./sandbox clean` - Limpiar entorno
- `./sandbox reset` - Reiniciar entorno 
- `./sandbox enter algod` - Entrar al container

### CLI Commands
- Crear la application
`goal app create --creator [ADDRESS] --approval-prog [APPROVAL_SOURCE] --clear-prog [CLEAR_SOURCE] --global-byteslices [GB_NUMBER] --global-ints [GI_NUMBER] --local-byteslices [LB_NUMBER] --local-ints [LI_NUMBER]`

- Ver detalles de la application
`goal app info --app-id [ID]`

- Acceder al estado global de la application
`goal app read --global --app-id [ID]`

- Acceder al estado local de la application
`goal app read --local --app-id [ID]`

- Hacer una transaccion
`goal app call --app-id [ID] -f [ADDRESS] --app-arg "[TYPE]:[VALUE]`

- Debugging
`goal app call —-app-id [ID] —-app-arg “[TYPE]:[VALUE]” —f [ADDRESS] -—out=dump.dr -—dryrun-dump`
`tealdbg debug [SOURCE_APPROVAL] -d dump.dr —-listen 0.0.0.0`

- Enviar ALGOs a la cuenta creada
Primero elegimos una de las cuentas en el sandbox
`goal account list`
Enviamos la transaccion
`goal clerk send -f [SENDER] -t [RECEIVER] -a 1000000`