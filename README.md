# Droplet Commands Nimbella

Perform DigitalOcean's Droplet related operations.

Available commands:

- `droplet_list` - Lists your droplets
- `droplet_reboot` - Issues a reboot command to the provided droplet.
- `droplet_status` - Prints the status of your droplets.

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

#### Droplet Status

You can know the status of all your droplets by running:

```
/devops droplet_status
```

To know the status of a single droplet:

```
/devops droplet_status <droplet_id>
```

**Note**: `droplet_status` depends on the result of DigitalOcean API. It doesn't perform any extra operations.
