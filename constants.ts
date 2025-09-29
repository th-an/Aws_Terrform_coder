
import { ModuleId, LearningModule } from './types';
import { TerraformIcon } from './components/icons/TerraformIcon';
import { ServerIcon } from './components/icons/ServerIcon';
import { StorageIcon } from './components/icons/StorageIcon';
import { NetworkIcon } from './components/icons/NetworkIcon';
import { SubnetIcon } from './components/icons/SubnetIcon';

// Each module with fields has a `defaultValue` for each field to ensure
// the form is always initialized with sensible values.
export const LEARNING_MODULES: LearningModule[] = [
  {
    id: ModuleId.INTRODUCTION,
    title: 'Introduction',
    description: 'Start your Terraform journey on AWS.',
    icon: TerraformIcon,
  },
  {
    id: ModuleId.EC2_INSTANCE,
    title: 'EC2 Instance',
    description: 'Deploy a virtual server.',
    icon: ServerIcon,
    fields: [
      { id: 'instance_name', label: 'Instance Name Tag', type: 'text', placeholder: 'my-ec2-instance', defaultValue: 'my-web-server' },
      { id: 'ami_id', label: 'AMI ID', type: 'text', placeholder: 'ami-0c55b159cbfafe1f0', defaultValue: 'ami-0c55b159cbfafe1f0', info: 'Amazon Machine Image ID for Amazon Linux 2 (us-east-1).'},
      { id: 'instance_type', label: 'Instance Type', type: 'select', options: ['t2.micro', 't3.small', 't3.medium'], defaultValue: 't2.micro' },
    ],
  },
  {
    id: ModuleId.S3_BUCKET,
    title: 'S3 Bucket',
    description: 'Create scalable object storage.',
    icon: StorageIcon,
    fields: [
      { id: 'bucket_name', label: 'Bucket Name', type: 'text', placeholder: 'my-unique-s3-bucket-name', defaultValue: `my-tf-bucket-${Date.now()}`, info: 'Must be globally unique.'},
      { id: 'acl', label: 'Access Control', type: 'select', options: ['private', 'public-read'], defaultValue: 'private' },
    ],
  },
  {
    id: ModuleId.VPC,
    title: 'Basic VPC',
    description: 'Set up an isolated network.',
    icon: NetworkIcon,
    fields: [
      { id: 'vpc_name', label: 'VPC Name Tag', type: 'text', placeholder: 'my-vpc', defaultValue: 'my-app-vpc' },
      { id: 'cidr_block', label: 'CIDR Block', type: 'text', placeholder: '10.0.0.0/16', defaultValue: '10.0.0.0/16', info: 'IPv4 address range for the VPC.' },
      { id: 'subnet_cidr_block', label: 'Subnet CIDR Block', type: 'text', placeholder: '10.0.1.0/24', defaultValue: '10.0.1.0/24', info: 'IPv4 address range for the public subnet.' },
    ]
  },
  {
    id: ModuleId.VPC_SUBNET,
    title: 'VPC Subnet',
    description: 'Create a public subnet within a VPC.',
    icon: SubnetIcon,
    fields: [
      { id: 'subnet_name', label: 'Subnet Name Tag', type: 'text', placeholder: 'my-public-subnet', defaultValue: 'my-public-subnet' },
      { id: 'vpc_id', label: 'VPC ID', type: 'text', placeholder: 'vpc-0123456789abcdef0', defaultValue: 'vpc-0123456789abcdef0', info: 'The ID of the VPC to create the subnet in.' },
      { id: 'cidr_block', label: 'CIDR Block', type: 'text', placeholder: '10.0.1.0/24', defaultValue: '10.0.1.0/24', info: 'Must be a valid CIDR and within the VPC\'s CIDR range.' },
      { id: 'availability_zone', label: 'Availability Zone', type: 'select', options: ['us-east-1a', 'us-east-1b', 'us-east-1c'], defaultValue: 'us-east-1a' },
    ]
  },
];
