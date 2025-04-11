import { useState } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const TestEmail = () => {
  const [loading, setLoading] = useState(false);

  const sendTestEmail = () => {
    setLoading(true);
    
    // Simple test data for debugging
    const templateParams = {
      user_name: "Test User",
      user_email: "test@example.com",
      user_phone: "1234567890",
      message: "This is a test message from the test page",
      property_title: "Test Property",
      property_location: "Test Location",
      property_id: "0"
    };
    
    // Use direct send method
    emailjs.send(
      'service_vukrrkb',
      'template_56ixdpl',
      templateParams,
      'IK3vSBYEhSRQfQ6Ti'
    )
      .then((result) => {
        console.log("SUCCESS", result.text);
        setLoading(false);
        Swal.fire({
          title: 'Test Email Sent Successfully!',
          html: `
            <div>
              <p>Response: ${result.text}</p>
              <p>Status: ${result.status}</p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#50312F'
        });
      })
      .catch((error) => {
        console.log("ERROR", error);
        setLoading(false);
        Swal.fire({
          title: 'Error!',
          html: `
            <div>
              <p>Error: ${JSON.stringify(error)}</p>
              <p>Please check browser console for more details.</p>
            </div>
          `,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#50312F'
        });
      });
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Test EmailJS</h1>
          <p className="mb-6">Click the button below to send a test email using EmailJS.</p>
          
          <div className="flex justify-center">
            <Button 
              onClick={sendTestEmail} 
              className="bg-primary text-white px-6 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Test Email"}
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h2 className="font-semibold mb-2">Test Data:</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify({
                service_id: 'service_vukrrkb',
                template_id: 'template_56ixdpl',
                user_id: 'IK3vSBYEhSRQfQ6Ti',
                template_params: {
                  user_name: "Test User",
                  user_email: "test@example.com",
                  user_phone: "1234567890",
                  message: "This is a test message"
                }
              }, null, 2)}
            </pre>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TestEmail; 