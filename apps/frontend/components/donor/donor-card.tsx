"use client";

import { QRCodeSVG } from "qrcode.react";
import { Drop } from "iconsax-reactjs";

interface Badge {
  label: string;
  color: string;
  emoji: string;
}

interface Donor {
  id: string;
  firstName: string;
  lastName: string;
  bloodGroup: string;
  rhesus: string;
  totalDonations: number;
  lastDonationDate: string;
  nextEligibleDate: string;
  commune: string;
  codeDonneur: string;
  phone: string;
}

interface DonorCardProps {
  donor: Donor;
  badge: Badge;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function DonorCard({ donor, badge }: DonorCardProps) {
  const qrData = JSON.stringify({
    id: donor.id,
    name: `${donor.firstName} ${donor.lastName}`,
    bloodGroup: `${donor.bloodGroup}${donor.rhesus}`,
    phone: donor.phone,
  });

  const whatsappText = encodeURIComponent(
    `Je suis donneur de sang Blood-Connect 🩸\n` +
    `Nom : ${donor.firstName} ${donor.lastName}\n` +
    `Groupe : ${donor.bloodGroup}${donor.rhesus}\n` +
    `Dons effectués : ${donor.totalDonations}\n` +
    `ID : ${donor.id}`
  );

  return (
    <div className="space-y-4">
      
      <div className="relative bg-linear-to-br from-red-600 to-red-800 rounded-3xl p-6 text-white overflow-hidden shadow-xl">
        
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-14 -left-8 w-52 h-52 bg-white/5 rounded-full" />

        
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <Drop size={16} color="white" variant="Bold" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/90 tracking-wider uppercase">
                eBloodSystem
              </p>
              <p className="text-xs text-white/60">République du Bénin</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white`}>
            {badge.emoji} {badge.label}
          </span>
        </div>

        
        <div className="relative z-10 mb-6">
          <div className="flex items-end gap-3">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
                Groupe sanguin
              </p>
              <p className="text-6xl font-black text-white leading-none">
                {donor.bloodGroup}
                <span className="text-3xl">{donor.rhesus}</span>
              </p>
            </div>
            <div className="mb-2">
              <p className="text-xs text-white/60">Dons effectués</p>
              <p className="text-2xl font-bold text-white">{donor.totalDonations}</p>
            </div>
          </div>
        </div>

        
        <div className="relative z-10 flex items-end justify-between">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-wider mb-1">
              Titulaire
            </p>
            <p className="text-lg font-bold text-white">
              {donor.firstName} {donor.lastName}
            </p>
            <p className="text-xs text-white/70 mt-0.5">{donor.commune}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60 mb-1">ID Donneur</p>
            <p className="text-xs font-mono font-semibold text-white/90">
              {donor.codeDonneur}
            </p>
            
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-6">
        
        <div className="shrink-0 p-2 bg-gray-50 rounded-xl border border-gray-100">
          <QRCodeSVG
            value={qrData}
            size={100}
            bgColor="transparent"
            fgColor="#111827"
            level="M"
          />
        </div>

        
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Dernier don
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(donor.lastDonationDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Prochain don éligible
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(donor.nextEligibleDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Téléphone
            </p>
            <p className="text-sm font-semibold text-gray-900">{donor.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}