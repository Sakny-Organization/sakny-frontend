import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PropertyForm from '../../components/property/PropertyForm';
import { createProperty } from '../../slices/propertySlice';

const mapFormToRequest = (values) => ({
  title: values.title,
  description: values.description,
  price: values.price,
  propertyType: (values.type || values.propertyType || 'APARTMENT').toUpperCase(),
  governorateId: values.governorateId ? parseInt(values.governorateId) : null,
  cityId: values.cityId ? parseInt(values.cityId) : null,
  address: values.address || null,
  latitude: values.location?.lat || null,
  longitude: values.location?.lng || null,
  roomsCount: values.rooms || values.roomsCount || null,
  bathroomsCount: values.bathrooms || values.bathroomsCount || null,
  floorNumber: values.floor || values.floorNumber || null,
  isFullyFurnished: Boolean(values.furnished ?? values.isFullyFurnished),
  availableFrom: values.availableFrom || null,
  amenityIds: Array.isArray(values.amenityIds) ? values.amenityIds : [],
  deposit: values.deposit || null,
  minimumStayMonths: values.minimumStayMonths || null,
  paymentPeriod: values.paymentPeriod || null,
  maxOccupancy: values.maxOccupancy || null,
  parkingSpots: values.parkingSpots || null,
  utilitiesIncluded: Boolean(values.utilitiesIncluded),
  internetIncluded: Boolean(values.internetIncluded),
  petsAllowed: Boolean(values.petsAllowed),
  smokingAllowed: Boolean(values.smokingAllowed),
  preferredTenant: values.preferredTenant || null,
});

const AddProperty = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { creating, createError } = useSelector((state) => state.properties);

  return (
    <DashboardLayout
      title="Add Property"
      subtitle="Fill in the details below and publish when ready"
    >
      {createError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {createError}
        </div>
      )}
      <PropertyForm
        submitting={creating}
        submitLabel="Publish property"
        onSubmit={async (values) => {
          const propertyData = mapFormToRequest(values);
          const images = values.images || [];
          const result = await dispatch(createProperty({ propertyData, images }));
          if (createProperty.fulfilled.match(result)) {
            navigate(`/properties/${result.payload.id}`);
          }
        }}
      />
    </DashboardLayout>
  );
};

export default AddProperty;
