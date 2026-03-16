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
      {/* Carte principale */}
      <div className="relative bg-linear-to-br from-red-600 to-red-800 rounded-3xl p-6 text-white overflow-hidden shadow-xl">
        {/* Cercles décoratifs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-14 -left-8 w-52 h-52 bg-white/5 rounded-full" />

        {/* Header carte */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <Drop size={16} color="white" variant="Bold" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/90 tracking-wider uppercase">
                Blood-Connect
              </p>
              <p className="text-xs text-white/60">République du Bénin</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white`}>
            {badge.emoji} {badge.label}
          </span>
        </div>

        {/* Groupe sanguin — élément central */}
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

        {/* Infos donneur */}
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
              {donor.id}
            </p>
            
          </div>
        </div>
      </div>

      {/* Section QR code + infos */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-6">
        {/* QR Code */}
        <div className="shrink-0 p-2 bg-gray-50 rounded-xl border border-gray-100">
          <QRCodeSVG
            value={qrData}
            size={100}
            bgColor="transparent"
            fgColor="#111827"
            level="M"
          />
        </div>

        {/* Infos */}
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

      {/* Bouton partager WhatsApp */}
      <a
        href={`https://wa.me/?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Partager sur WhatsApp
      </a>
    </div>
  );
}