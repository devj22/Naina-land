import React, { useRef } from 'react';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

const PropertyDetailPage: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(formRef.current!);
      const data = {
        user_name: formData.get('user_name'),
        user_email: formData.get('user_email'),
        user_phone: formData.get('user_phone'),
        message: formData.get('message'),
        property_title: formData.get('property_title'),
        property_location: formData.get('property_location'),
        property_id: formData.get('property_id')
      };

      // Debug log
      console.log('Sending data to EmailJS:', data);

      const result = await emailjs.send(
        'service_vukrrkb',
        'template_56ixdpl',
        data,
        'IK3vSBYEhSRQfQ6Ti'
      );

      // Debug log
      console.log('EmailJS response:', result);

      Swal.fire({
        title: 'Success!',
        text: 'Your inquiry has been sent successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      formRef.current?.reset();
    } catch (error) {
      console.error('Error sending email:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to send inquiry. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Render your form here */}
    </div>
  );
};

export default PropertyDetailPage; 