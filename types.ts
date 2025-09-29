// FIX: Import React to resolve 'Cannot find namespace 'JSX'' error.
import React from 'react';

export enum ModuleId {
  INTRODUCTION = 'introduction',
  EC2_INSTANCE = 'ec2_instance',
  S3_BUCKET = 's3_bucket',
  VPC = 'vpc',
  VPC_SUBNET = 'vpc_subnet',
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  info?: string;
}

export interface LearningModule {
  id: ModuleId;
  title: string;
  description: string;
  // FIX: Use React.ReactElement instead of JSX.Element to avoid namespace error.
  icon: (props: { className?: string }) => React.ReactElement;
  fields?: FormField[];
}

export interface GenerationResult {
  code: string;
  explanation: string;
}
