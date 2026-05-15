"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile, updateProfile } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, User, Mail, Phone, MapPin, Save } from "lucide-react";
import Link from "next/link";

const UpdateProfile = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name ?? "");
      setLastName(user.last_name ?? "");
      setPhoneNumber(user.phone_number ?? "");
      setAddress(user.address ?? "");
    }
  }, [user]);

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setTimeout(() => router.push("/profile"), 1500);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      address,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-14">
          <div className="container mx-auto px-4 text-center">
            <div className="h-7 bg-gray-700 rounded w-48 mx-auto animate-pulse" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-lg mx-auto space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const fields = [
    {
      id: "first_name",
      label: "First Name",
      icon: User,
      value: firstName,
      onChange: setFirstName,
      required: true,
      placeholder: "Enter your first name",
    },
    {
      id: "last_name",
      label: "Last Name",
      icon: User,
      value: lastName,
      onChange: setLastName,
      required: true,
      placeholder: "Enter your last name",
    },
    {
      id: "phone_number",
      label: "Phone Number",
      icon: Phone,
      value: phoneNumber,
      onChange: setPhoneNumber,
      required: false,
      placeholder: "Enter your phone number",
    },
    {
      id: "address",
      label: "Address",
      icon: MapPin,
      value: address,
      onChange: setAddress,
      required: false,
      placeholder: "Enter your delivery address",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-orange-400 mb-3">
            <User className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Settings
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Update Profile
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-lg mx-auto">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Profile
          </Link>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                Personal Information
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update your personal details below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {fields.map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5"
                  >
                    <field.icon className="w-4 h-4 text-gray-400" />
                    {field.label}
                    {field.required && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    id={field.id}
                    type="text"
                    required={field.required}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  />
                </div>
              ))}

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                  {error.message}
                </div>
              )}
              {isSuccess && (
                <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg">
                  Profile updated! Redirecting...
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
