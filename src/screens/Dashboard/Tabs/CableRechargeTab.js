import React, { useState } from "react"
import { ScrollView, View } from "react-native"
import { useTheme } from "../../../contexts/ThemeContext"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import AnimatedDropdown from "../../../components/ui/AnimatedDropdown"

const CableRechargeTab = ({ navigation }) => {
  const { theme } = useTheme()

  // 🔧 State declarations for each field
  const [refidNo, setRefidNo] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [mobile, setMobile] = useState("")
  const [street1, setStreet1] = useState("")
  const [street2, setStreet2] = useState("")
  const [packageName, setPackageName] = useState("")
  const [packageAmount, setPackageAmount] = useState("")
  const [voucher, setVoucher] = useState("")
  const [setupBoxNumber, setSetupBoxNumber] = useState("")
  const [totAmt, setTotAmt] = useState("")
  const [enterPin, setEnterPin] = useState("")
  const [errors, setErrors] = useState({})

  const handleSubmit = () => {
    const newErrors = {}

    if (!refidNo) newErrors.refidNo = "Ref ID is required"
    if (!totAmt) newErrors.walletAmt = "Amount is required"
    if (!enterPin) newErrors.enterPin = "PIN is required"

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      console.log("Submit cable recharge", {
        refidNo,
        customerName,
        mobile,
        street1,
        street2,
        packageName,
        packageAmount,
        voucher,
        setupBoxNumber,
        totAmt,
        enterPin,
      })
    }
  }

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        <Input
          value={refidNo}
          onChangeText={setRefidNo}
          placeholder="Enter Refid"
          keyboardType="numeric"
          autoCapitalize="none"
          error={errors.refidNo}
          theme={theme}
        />

        <Input
          value={customerName}
          onChangeText={setCustomerName}
          placeholder="Enter Customer Name"
          autoCapitalize="none"
          theme={theme}
        />

        <Input
          value={mobile}
          onChangeText={setMobile}
          placeholder="Enter mobile number"
          keyboardType="numeric"
          autoCapitalize="none"
          error={errors.mobile}
          theme={theme}
        />

        <Input
          value={street1}
          onChangeText={setStreet1}
          placeholder="Street 1"
          autoCapitalize="none"
          theme={theme}
        />

        <Input
          value={street2}
          onChangeText={setStreet2}
          placeholder="Street 2"
          autoCapitalize="none"
          theme={theme}
        />

        <Input
          value={packageName}
          onChangeText={setPackageName}
          placeholder="Package"
          autoCapitalize="none"
          theme={theme}
        />

        <Input
          value={packageAmount}
          onChangeText={setPackageAmount}
          placeholder="Package Amount"
          autoCapitalize="none"
          keyboardType="numeric"
          theme={theme}
        />

        <Input
          value={voucher}
          onChangeText={setVoucher}
          placeholder="Voucher"
          autoCapitalize="none"
          theme={theme}
        />

        <Input
          value={setupBoxNumber}
          onChangeText={setSetupBoxNumber}
          placeholder="SetUPBox Number"
          autoCapitalize="none"
          theme={theme}
        />

        <Input
          value={totAmt}
          onChangeText={setTotAmt}
          placeholder="Total Amount ₹"
          keyboardType="numeric"
          autoCapitalize="none"
          error={errors.walletAmt}
          theme={theme}
        />

        <Input
          value={enterPin}
          onChangeText={setEnterPin}
          placeholder="Enter PIN"
          secureTextEntry
          error={errors.enterPin}
          theme={theme}
        />

        <Button
          title="Pay Now"
          className="mt-4"
          onPress={handleSubmit}
          theme={theme}
        />
      </ScrollView>
    </View>
  )
}

export default CableRechargeTab
