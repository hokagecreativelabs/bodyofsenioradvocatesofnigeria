"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LoginModal = ({ isOpen, onClose }) => {
  const { loginMutation, registerMutation } = useAuth();
  const router = useRouter();
  const initialFocusRef = useRef(null);

  // State to toggle between login and signup forms
  const [isSignup, setIsSignup] = useState(false);
  
  // Form field states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  
  // Error states
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  
  // Track if fields have been touched
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        fullName: "",
        email: "",
        password: ""
      });
      setErrors({
        fullName: "",
        email: "",
        password: ""
      });
      setTouched({
        fullName: false,
        email: false,
        password: false
      });
    }
  }, [isOpen]);

  // Focus on initial field
  useEffect(() => {
    if (isOpen && initialFocusRef.current) {
      setTimeout(() => {
        initialFocusRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isSignup]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (value.trim() !== "") {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  // Mark field as touched when user leaves input
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    
    // Validate on blur
    validateField(name, formData[name]);
  };

  // Validate individual field
  const validateField = (name, value) => {
    let errorMessage = "";
    
    if (name === "fullName" && isSignup) {
      if (!value.trim()) {
        errorMessage = "Full name is required";
      }
    } else if (name === "email") {
      if (!value.trim()) {
        errorMessage = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errorMessage = "Please enter a valid email address";
      }
    } else if (name === "password") {
      if (!value.trim()) {
        errorMessage = "Password is required";
      } else if (isSignup && value.length < 8) {
        errorMessage = "Password must be at least 8 characters long";
      }
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
    
    return !errorMessage;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate each field
    if (isSignup) {
      isValid = validateField("fullName", formData.fullName) && isValid;
      newErrors.fullName = !formData.fullName.trim() ? "Full name is required" : "";
    }
    
    isValid = validateField("email", formData.email) && isValid;
    isValid = validateField("password", formData.password) && isValid;
    
    // Set all fields as touched
    setTouched({
      fullName: true,
      email: true,
      password: true
    });
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isSignup) {
        await registerMutation.mutateAsync({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        });
      } else {
        await loginMutation.mutateAsync({
          email: formData.email,
          password: formData.password
        });
      }
      onClose();
      router.push("/dashboard");
    } catch (error) {
      console.error(isSignup ? "Signup error:" : "Login error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl text-blue-900">
            {isSignup ? "Create an Account" : "Member Login"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {isSignup && (
            <div className="space-y-2">
              <label className="text-gray-800 font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                ref={isSignup ? initialFocusRef : null}
                placeholder="Your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              {touched.fullName && errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-gray-800 font-medium">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              ref={!isSignup ? initialFocusRef : null}
              placeholder="your.email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-gray-800 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Your password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSignup ? registerMutation.isPending : loginMutation.isPending}
            className="w-full bg-blue-900 text-white font-medium py-2 px-4 rounded hover:bg-opacity-90 transition duration-300 mt-6"
          >
            {isSignup 
              ? (registerMutation.isPending ? "Signing up..." : "Sign Up") 
              : (loginMutation.isPending ? "Logging in..." : "Login")
            }
          </Button>
        </form>

        <div className="pt-4 border-t text-center">
          <p className="text-gray-600 text-sm">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-blue-900 font-medium hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSignup(false);
                  }}
                >
                  Login here
                </a>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <a
                  href="#"
                  className="text-blue-900 font-medium hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsSignup(true);
                  }}
                >
                  Sign up here
                </a>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;