import Card from "../components/Card";

export default function PositionCard(props) {

    return (
        <div class="h-24 py-4 px-6 flex">
            <div class="w-2/12 bg-gray-100">
                logo here
            </div>
            <div class="w-8/12 px-4">
                <div class="font-semibold">
                    Microsoft Corporation
                </div>
                <div class="text-gray-500">
                    MSFT | 9 shares
                </div>
            </div>
            <div class="w-2/12">
                <div class="text-gray-900">
                    £5,121.41
                </div>
                <div class="text-green-400">
                    38.2% 
                </div>
            </div>
        </div>
    )
}