# DB

Minimalistic authentication database

## Schema

_See setup.sql_

## Connection settings

| setting  | value     |
| -------- | --------- |
| host     | localhost |
| username | postgres  |
| password | password  |
| port     | 5432      |
| database | postgres  |
| sslmode  | false     |

## User Defined Functions

| Description                             | Query                                                                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Add a new row to account table          | SELECT create_account('username', 'password');                                                                           |
| Get account_id that matches credentials | SELECT account_id_with_credentials('username', 'password');                                                              |
| Set new password for account            | SELECT set_password(account_id, 'new+password') FROM (SELECT account_id FROM account WHERE username = 'username') AS \_; |
| Soft delete account with account_id 10  | SELECT soft_delete_account(10);                                                                                          |

## Resources

[Download DBeaver](https://dbeaver.io/download)
