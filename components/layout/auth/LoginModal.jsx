"use client";

import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Use Next.js router
import { X } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const LoginModal = ({ isOpen, onClose }) => {
  const { loginMutation } = useAuth();
  const router = useRouter(); // Initialize Next.js router
  const initialFocusRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  useEffect(() => {
    if (isOpen && initialFocusRef.current) {
      setTimeout(() => {
        initialFocusRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    try {
      await loginMutation.mutateAsync(data);
      onClose();
      router.push("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="font-playfair font-bold text-xl text-[#0F2C59]">
              Member Login
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#343A40] font-montserrat">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      ref={initialFocusRef}
                      placeholder="your.email@example.com" 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#343A40] font-montserrat">Password</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      placeholder="Your password" 
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0F2C59]"
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="flex justify-end mt-1">
                    <a href="#" className="text-[#750E21] text-sm hover:underline">Forgot password?</a>
                  </div>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={loginMutation.isPending}
              className="w-full bg-[#0F2C59] text-white font-montserrat font-medium py-2 px-4 rounded hover:bg-opacity-90 transition duration-300 mt-6"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="pt-4 border-t text-center">
          <p className="text-[#343A40]/80 text-sm">
            Not a member yet? Please contact the BOSAN secretariat for membership information or 
            <a href="/auth" className="text-[#0F2C59] font-medium hover:underline" onClick={onClose}>
              register here
            </a>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
