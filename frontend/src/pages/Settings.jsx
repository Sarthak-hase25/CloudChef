import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Lock, Database } from "lucide-react";

export default function Settings() {
  return (
    <div className="page-content max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon size={22} className="text-brand-400"/> Settings
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your account and platform preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Nav */}
        <div className="space-y-1 text-sm">
          <button className="w-full flex items-center gap-2 p-3 rounded-xl bg-brand-500/15 text-brand-400 font-medium">
            <User size={16}/> Profile & Account
          </button>
          <button className="w-full flex items-center gap-2 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <Database size={16}/> Kitchen Details
          </button>
          <button className="w-full flex items-center gap-2 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <Bell size={16}/> Notifications
          </button>
          <button className="w-full flex items-center gap-2 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-colors">
            <Lock size={16}/> Security
          </button>
        </div>

        {/* Content */}
        <motion.div className="md:col-span-2 space-y-4" initial={{opacity:0, x:16}} animate={{opacity:1, x:0}}>
          <div className="card p-6 space-y-6">
            <h2 className="section-title">Profile Information</h2>
            
            <div className="flex items-center gap-4 pb-6 border-b border-white/5">
              <div className="w-16 h-16 rounded-xl bg-brand-500/30 flex items-center justify-center text-brand-400 font-bold text-2xl">
                S
              </div>
              <div>
                <button className="btn-secondary text-xs py-1.5 px-3">Change Avatar</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Full Name</label>
                <input type="text" className="input" defaultValue="Darshana Chaudhari"/>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Email Address</label>
                <input type="email" className="input" defaultValue="owner@kitchen.com" disabled/>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Phone</label>
                <input type="text" className="input" defaultValue="+91 98765-43210"/>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Role</label>
                <input type="text" className="input" defaultValue="Owner" disabled/>
              </div>
            </div>
            
            <div className="pt-2 flex justify-end">
              <button className="btn-primary">Save Changes</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
