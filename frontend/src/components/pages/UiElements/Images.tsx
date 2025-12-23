import PageBreadcrumb from "../../common/PageBreadCrumb";
import ResponsiveImage from "../../ui/images/ResponsiveImage";
import TwoColumnImageGrid from "../../ui/images/TwoColumnImageGrid";
import ThreeColumnImageGrid from "../../ui/images/ThreeColumnImageGrid";
import ComponentCard from "../../common/ComponentCard";
import React from "react";

export default function Images() {
  return (
    <>
 
      <PageBreadcrumb pageTitle="Images" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Responsive image">
          <ResponsiveImage />
        </ComponentCard>
        <ComponentCard title="Image in 2 Grid">
          <TwoColumnImageGrid />
        </ComponentCard>
        <ComponentCard title="Image in 3 Grid">
          <ThreeColumnImageGrid />
        </ComponentCard>
      </div>
    </>
  );
}
