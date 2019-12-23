# Droplet Commands Nimbella

Perform DigitalOcean's Droplet related operations.

Available commands:

- `droplet_list` - Lists your droplets
- `droplet_reboot` - Issues a reboot command to the provided droplet.

## Install

```
/nc csm_install github:satyarohith/droplet_commands_nimbella
```

## Usage

#### Droplet List

You can list your droplets with your current app:

```
/devops droplet_list
```

#### Droplet Reboot

You need to provide your droplet ID to the command.

```
/devops droplet_reboot <droplet_id>
```

It will initiate a reboot request.
