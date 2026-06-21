import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PropertyForm from '../../components/property/PropertyForm';
import { fetchProperty, updateProperty } from '../../slices/propertySlice';

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
  prefTenantGender: values.prefTenantGender || null,
  prefTenantType: values.prefTenantType || null,
  prefSmoking: values.prefSmoking || null,
  prefPets: values.prefPets || null,
  prefSleepSchedule: values.prefSleepSchedule || null,
  prefCleanliness: values.prefCleanliness || null,
  prefMinAge: values.prefMinAge ? parseInt(values.prefMinAge) : null,
  prefMaxAge: values.prefMaxAge ? parseInt(values.prefMaxAge) : null,
});

const EditProperty = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { activeProperty, detailLoading, createError } = useSelector((state) => state.properties);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    dispatch(fetchProperty(id));
  }, [id, dispatch]);

  if (detailLoading || !activeProperty) {
    return (
      <DashboardLayout title="Edit Property" subtitle="Loading...">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black" />
        </div>
      </DashboardLayout>
    );
  }

  // Map PropertyResponse shape back to PropertyForm shape
  const initialValues = {
    ...activeProperty,
    type: activeProperty.propertyType?.toLowerCase(),
    rooms: activeProperty.roomsCount,
    bathrooms: activeProperty.bathroomsCount,
    floor: activeProperty.floorNumber,
    furnished: activeProperty.isFullyFurnished,
    governorateId: activeProperty.governorateId || '',
    cityId: activeProperty.cityId || '',
    city: activeProperty.city,
    amenities: (activeProperty.amenities || []).map((a) => a.nameEn || a),
    amenityIds: (activeProperty.amenities || []).map((a) => a.id).filter(Boolean),
    location: activeProperty.latitude && activeProperty.longitude
      ? { lat: Number(activeProperty.latitude), lng: Number(activeProperty.longitude) }
      : null,
  };

  return (
    <DashboardLayout
      title="Edit Property"
      subtitle="Update your listing details below"
    >
      {createError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {createError}
        </div>
      )}
      <PropertyForm
        initialValues={initialValues}
        submitting={submitting}
        submitLabel="Update property"
        onSubmit={async (values) => {
          setSubmitting(true);
          const propertyData = mapFormToRequest(values);
          const result = await dispatch(updateProperty({ id: parseInt(id), propertyData }));
          setSubmitting(false);
          if (updateProperty.fulfilled.match(result)) {
            navigate(`/properties/${id}`);
          }
        }}
      />
    </DashboardLayout>
  );
};

export default EditProperty;
