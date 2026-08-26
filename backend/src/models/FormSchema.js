import mongoose from 'mongoose';

const formSchemaDefinition = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  icon: {
    type: String,
    default: '📋',
  },
  tag: {
    type: String,
    default: 'Government of India',
  },
  tagColor: {
    type: String,
    default: '#FF7A00',
  },
  available: {
    type: Boolean,
    default: true,
  },
  sections: [
    {
      title: String,
      icon: String,
      fields: [
        {
          id: String,
          label: String,
          type: {
            type: String,
            default: 'text',
          },
          required: {
            type: Boolean,
            default: true,
          },
          options: [String],
          placeholder: String,
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const FormSchemaModel = mongoose.model('FormSchema', formSchemaDefinition);
