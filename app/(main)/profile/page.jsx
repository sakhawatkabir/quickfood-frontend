"use client";

import React from "react";
import Link from "next/link";
import { fetchProfile } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import OrderHistory from "@/components/OrderHistory";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Calendar,
  Shield,
} from "lucide-react";

const ProfilePage = () => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-14">
          <div className="container mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-700 rounded w-40 mx-auto animate-pulse" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-2xl mx-auto space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-red-500 text-lg">{error.message}</p>
        </div>
      </div>
    );
  }

  const fields = [
    { icon: User, label: "First Name", value: user.first_name },
    { icon: User, label: "Last Name", value: user.last_name },
    { icon: Mail, label: "Email Address", value: user.email },
    { icon: Phone, label: "Phone Number", value: user.phone_number },
    { icon: MapPin, label: "Address", value: user.address },
    { icon: Shield, label: "Role", value: user.role?.replace(/_/g, " ") },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {user.first_name
              ? `${user.first_name} ${user.last_name || ""}`
              : user.username}
          </h1>
          <p className="text-gray-400 mt-1">{user.email}</p>
          <Link
            href="/profile/update"
            className="inline-flex items-center gap-1.5 mt-4 px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                Profile Information
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {fields.map((field) => (
                <div
                  key={field.label}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <field.icon className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">
                      {field.label}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {field.value || "Not provided"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order history */}
          <OrderHistory />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
