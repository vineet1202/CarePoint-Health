import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Stethoscope,
  Clock,
  GraduationCap,
  ArrowRight,
  HeartPulse,
  Brain,
  Bone,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useDebounce } from "@/hooks/useDebounce";
import { useDoctors } from "../hooks/useDoctors";
import { PageLoader } from "@/components/ui/pageLoader";

const specializations = [
  {
    name: "Cardiologist",
    description: "Heart and cardiovascular care",
    icon: HeartPulse,
  },
  {
    name: "General Medicine",
    description: "General health and primary care",
    icon: Stethoscope,
  },
  {
    name: "Neurosurgeon",
    description: "Brain and nervous system care",
    icon: Brain,
  },
  {
    name: "Orthopedic Surgeon",
    description: "Bones, joints and muscles",
    icon: Bone,
  },
];

export default function FindDoctorsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useDoctors(debouncedSearch.trim(), 0);

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          CarePoint Directory
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Find a Doctor
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find the right specialist for your healthcare needs.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by specialization, e.g. Cardiology"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 rounded-xl bg-card/70 pl-10 shadow-sm backdrop-blur-xl"
        />
      </div>
      {/* Popular Specializations */}
      {!search.trim() && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Popular Specializations
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse doctors by their area of expertise.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {specializations.map((specialization) => {
              const Icon = specialization.icon;

              return (
                <Card
                  key={specialization.name}
                  onClick={() => setSearch(specialization.name)}
                  className="group cursor-pointer border-border/60 bg-card/70 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/15">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm">
                        {specialization.name}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {specialization.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Initial state */}
      {!search.trim() && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/40 px-6 py-16 text-center">
          <div className="rounded-2xl bg-primary/10 p-4">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-5 text-lg font-semibold">
            Find the right doctor for you
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Search for a specialization to explore doctors, their
            qualifications, experience and consultation fees.
          </p>
        </div>
      )}

      {/* Loading */}
      {search.trim() && isLoading && <PageLoader />}

      {/* Error */}
      {search.trim() && isError && (
        <p className="text-sm text-destructive">
          Something went wrong while fetching doctors.
        </p>
      )}

      {/* Results */}
      {search.trim() && !isLoading && !isError && data && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Search results</h2>
            <span className="text-sm text-muted-foreground">
              {data.totalElements} doctor(s) found
            </span>
          </div>

          {data.content.length === 0 ? (
            <div className="rounded-xl border border-dashed py-12 text-center">
              <Stethoscope className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 font-medium">No doctors found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try searching for another specialization.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {data.content.map((doctor) => (
                <Card
                  key={doctor.id}
                  className="group border-border/60 bg-card/70 shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Stethoscope className="h-6 w-6 text-primary" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold">
                          {doctor.fullName}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-primary">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <GraduationCap className="h-4 w-4 shrink-0" />
                        <span>
                          {doctor.qualification ||
                            "Qualification not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>
                          {doctor.experienceYears != null
                            ? `${doctor.experienceYears} years experience`
                            : "Experience not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-muted-foreground">
                        {/* <IndianRupee className="h-4 w-4 shrink-0" /> */}
                        <span>
                          Consultation fee: ₹ {doctor.consultationFee}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-border/60 pt-4">
                      <Button
                        className="w-full justify-between"
                        onClick={() =>
                          navigate(`/patient/doctors/${doctor.id}`)
                        }
                      >
                        View profile
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
