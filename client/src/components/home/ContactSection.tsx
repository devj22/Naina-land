import { useState, useRef } from "react";
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertMessageSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = insertMessageSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactSection = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: "Residential Plot",
      message: "",
    },
  });

  function onSubmit(values: ContactFormValues) {
    setSubmitting(true);
    
    if (!formRef.current) return;
    
    // Prepare hidden fields with form values
    const formData = new FormData();
    formData.append('user_name', values.name);
    formData.append('user_email', values.email);
    formData.append('user_phone', values.phone);
    formData.append('interest', values.interest);
    formData.append('message', values.message);
    
    // Transfer values to form elements for EmailJS
    Array.from(formData.entries()).forEach(([name, value]) => {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = name;
      hiddenField.value = value as string;
      formRef.current?.appendChild(hiddenField);
    });
    
    // Use EmailJS sendForm
    emailjs.sendForm(
      'service_vukrrkb',
      'template_56ixdpl',
      formRef.current,
      'IK3vSBYEhSRQfQ6Ti'
    )
      .then((result) => {
        // Show a success message box
        Swal.fire({
          title: 'Message Sent Successfully!',
          text: 'We will get back to you as soon as possible.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#50312F'
        });
        form.reset();
        setSubmitting(false);
        
        // Clean up hidden fields
        Array.from(formRef.current?.querySelectorAll('input[type="hidden"]') || [])
          .forEach(el => formRef.current?.removeChild(el));
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to send message. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#50312F'
        });
        setSubmitting(false);
        console.error("EmailJS error:", error);
        
        // Clean up hidden fields
        Array.from(formRef.current?.querySelectorAll('input[type="hidden"]') || [])
          .forEach(el => formRef.current?.removeChild(el));
      });
  }

  return (
    <section className="py-20 bg-[#F8F8F8]" id="contact">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-stretch gap-12">
          <div className="lg:w-1/2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Have questions about our properties or need expert advice? Fill out the form below and our team will get back to you promptly.
            </p>
            
            <Form {...form}>
              <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input id="user_name" placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input id="user_email" placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input id="user_phone" placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger id="interest">
                              <SelectValue placeholder="Select your interest" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Residential Plot">Residential Plot</SelectItem>
                            <SelectItem value="Agricultural Land">Agricultural Land</SelectItem>
                            <SelectItem value="Commercial Plot">Commercial Plot</SelectItem>
                            <SelectItem value="Investment Advice">Investment Advice</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          id="message_content" 
                          placeholder="Your message" 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="lg:w-1/2 flex flex-col">
            <div className="bg-primary text-white p-8 rounded-lg shadow-md mb-8 flex-1">
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-4 text-[#FF6B35]"></i>
                  <p>
                    #2506, The Park luxury,Apt. Oshiwara, <br />
                    Andheri west Mumbai, <br />
                    India
                  </p>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-phone-alt mr-4 text-[#FF6B35]"></i>
                  <p>+91 98765 43210</p>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-envelope mr-4 text-[#FF6B35]"></i>
                  <p>infonainaland@gmail.com</p>
                </div>
                
                <div className="flex items-center">
                  <i className="fas fa-clock mr-4 text-[#FF6B35]"></i>
                  <p>Monday - Saturday: 9 AM - 6 PM</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-white hover:text-[#FF6B35] transition">
                    <i className="fab fa-facebook-f text-xl"></i>
                  </a>
                  <a href="#" className="text-white hover:text-[#FF6B35] transition">
                    <i className="fab fa-twitter text-xl"></i>
                  </a>
                  <a href="#" className="text-white hover:text-[#FF6B35] transition">
                    <i className="fab fa-instagram text-xl"></i>
                  </a>
                  <a href="#" className="text-white hover:text-[#FF6B35] transition">
                    <i className="fab fa-linkedin-in text-xl"></i>
                  </a>
                  <a href="#" className="text-white hover:text-[#FF6B35] transition">
                    <i className="fab fa-youtube text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
