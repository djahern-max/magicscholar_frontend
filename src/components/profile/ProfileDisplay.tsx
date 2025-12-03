// src/components/profile/ProfileDisplay.tsx


'use client';

import React, { ReactNode } from 'react';
import { Profile } from '@/lib/types/profile';
import { useRouter } from 'next/navigation';

interface ProfileDisplayProps {
  profile: Profile;
}

export default function ProfileDisplay({ profile }: ProfileDisplayProps) {
  const router = useRouter();

  const initials =
    profile.high_school_name?.trim()?.charAt(0).toUpperCase() || '?';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <SectionCard>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {profile.profile_image_url ? (
              <img
                src={profile.profile_image_url}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-semibold text-gray-600">
                  {initials}
                </span>
              </div>
            )}

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {profile.high_school_name || 'Your Profile'}
              </h1>
              <div className="mt-1 space-y-0.5 text-sm text-gray-600">
                {profile.city && profile.state && (
                  <p>
                    {profile.city}, {profile.state}
                  </p>
                )}
                {profile.graduation_year && (
                  <p>Class of {profile.graduation_year}</p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/profile/edit')}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </SectionCard>

      {/* Academics */}
      <SectionCard title="School & Academics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="High School" value={profile.high_school_name} />
          <InfoField
            label="GPA"
            value={
              profile.gpa
                ? `${profile.gpa} ${profile.gpa_scale ? `/ ${profile.gpa_scale}` : ''}`
                : undefined
            }
          />
          <InfoField label="SAT" value={profile.sat_score} />
          <InfoField label="ACT" value={profile.act_score} />
          <InfoField label="Intended Major" value={profile.intended_major} />
        </div>
      </SectionCard>

      {/* Career Goals */}
      {profile.career_goals && (
        <SectionCard title="Career Goals">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {profile.career_goals}
          </p>
        </SectionCard>
      )}

      {/* Extracurriculars */}
      {profile.extracurriculars && profile.extracurriculars.length > 0 && (
        <SectionCard title="Activities">
          <div className="space-y-4">
            {profile.extracurriculars.map((activity, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-3">
                <h3 className="font-semibold text-gray-900">
                  {activity.name}
                </h3>
                <div className="mt-1 space-y-0.5 text-sm text-gray-600">
                  {activity.role && <p>{activity.role}</p>}
                  {activity.years_active && <p>{activity.years_active}</p>}
                </div>
                {activity.description && (
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {activity.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Work Experience */}
      {profile.work_experience && profile.work_experience.length > 0 && (
        <SectionCard title="Work Experience">
          <div className="space-y-4">
            {profile.work_experience.map((work, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-3">
                <h3 className="font-semibold text-gray-900">
                  {work.title}
                </h3>
                <div className="mt-1 space-y-0.5 text-sm text-gray-600">
                  {work.organization && <p>{work.organization}</p>}
                  {work.dates && <p>{work.dates}</p>}
                </div>
                {work.description && (
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {work.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Honors & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile.honors_awards && profile.honors_awards.length > 0 && (
          <SectionCard title="Honors & Awards">
            <ul className="list-disc list-inside space-y-1.5 text-gray-700 text-sm">
              {profile.honors_awards.map((honor, index) => (
                <li key={index}>{honor}</li>
              ))}
            </ul>
          </SectionCard>
        )}

        {profile.skills && profile.skills.length > 0 && (
          <SectionCard title="Skills">
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </SectionCard>
        )}
      </div>

      {/* Resume Link */}
      {profile.resume_url && (
        <SectionCard title="Resume">
          <a
            href={profile.resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
          >
            View resume (PDF)
          </a>
        </SectionCard>
      )}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      {title && (
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  if (value === undefined || value === null || value === '') return null;

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-gray-900">{value}</p>
    </div>
  );
}
