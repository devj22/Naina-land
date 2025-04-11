import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactSection: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    try {
      const emailData = {
        user_name: data.name,
        user_email: data.email,
        user_phone: data.phone,
        message: data.message
      };

      // Debug log
      console.log('Sending data to EmailJS:', emailData);

      const result = await emailjs.send(
        'service_vukrrkb',
        'template_56ixdpl',
        emailData,
        'IK3vSBYEhSRQfQ6Ti'
      );

      // Debug log
      console.log('EmailJS response:', result);

      Swal.fire({
        title: 'Success!',
        text: 'Your message has been sent successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      reset();
    } catch (error) {
      console.error('Error sending email:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to send message. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input 
            type="text" 
            {...register('name', { required: true })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" 
            placeholder="Your name"
          />
          {errors.name && <span className="text-red-500 text-sm">Name is required</span>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            {...register('email', { required: true })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" 
            placeholder="Your email"
          />
          {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input 
            type="tel" 
            {...register('phone', { required: true })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" 
            placeholder="Your phone number"
          />
          {errors.phone && <span className="text-red-500 text-sm">Phone is required</span>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea 
          rows={4}
          {...register('message', { required: true })}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary" 
          placeholder="Your message"
        ></textarea>
        {errors.message && <span className="text-red-500 text-sm">Message is required</span>}
      </div>
      <button 
        type="submit" 
        className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition"
        disabled={submitting}
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactSection; 